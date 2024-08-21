import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { addresses } from 'src/db/schema';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {
  constructor(@Inject('DATABASE') private db: any) {}

  async createAddress(userId: number, addressData: CreateAddressDto) {
    const [address] = await this.db
      .insert(addresses)
      .values({ ...addressData, userId })
      .returning();

    return address;
  }

  async getAddressByUserId(userId: number) {
    const address = await this.db.query.addresses.findFirst({
      where: eq(addresses.userId, userId),
    });

    return address;
  }

  async updateAddress(userId: number, addressData: UpdateAddressDto) {
    // Check if addressData is empty
    if (Object.keys(addressData).length === 0) {
      throw new BadRequestException('No update data provided');
    }

    // Remove all undefined values
    const filteredAddressData = Object.entries(addressData).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    // Check if there are any values to update after filtering
    if (Object.keys(filteredAddressData).length === 0) {
      throw new BadRequestException('No valid update data provided');
    }

    const [updatedAddress] = await this.db
      .update(addresses)
      .set(addressData)
      .where(eq(addresses.userId, userId))
      .returning();

    if (!updatedAddress) {
      throw new NotFoundException('Address not found');
    }

    return updatedAddress;
  }

  async deleteAddress(userId: number) {
    const [deletedAddress] = await this.db
      .delete(addresses)
      .where(eq(addresses.userId, userId))
      .returning();

    if (!deletedAddress) {
      throw new NotFoundException('Address not found');
    }

    return { message: 'Address deleted successfully' };
  }
}
