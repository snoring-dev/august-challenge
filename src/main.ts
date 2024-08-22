import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { definitions, frenchWords } from './db/schema';
import { db } from './db/db';
import { parseDefinitions } from './utils/parse-definitions.util';

async function importWords(): Promise<void> {
  console.log('Starting CSV import...');
  let importedWordsCount = 0;
  let failedImportsCount = 0;
  const parser = parse({ columns: true, delimiter: ',' });
  const readStream = createReadStream('src/assets/french_dico.csv');

  readStream.pipe(parser);

  for await (const record of parser) {
    const word = record['Mot'];
    const definitionsArray = parseDefinitions(record['Définitions']);

    try {
      // Insert word
      const [insertedWord] = await db
        .insert(frenchWords)
        .values({ word })
        .returning({ id: frenchWords.id });

      // Insert definitions
      for (const definition of definitionsArray) {
        await db
          .insert(definitions)
          .values({ wordId: insertedWord.id, definition });
      }

      importedWordsCount += 1;
    } catch (error) {
      console.error(`Error importing word ${word}:`, error.message);
      failedImportsCount += 1;
    }
  }

  console.log(
    `CSV import completed [Imported: ${importedWordsCount}, Failed: ${failedImportsCount}]`,
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  await importWords();
}

bootstrap();
