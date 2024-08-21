import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  async createAddress(
    @Request() req,
    @Body()
    addressData: CreateAddressDto,
  ) {
    const userId = req.user.userId;
    return this.addressService.createAddress(userId, addressData);
  }

  @Get()
  async getAddress(@Request() req) {
    const userId = req.user.userId;
    const address = await this.addressService.getAddressByUserId(userId);

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  @Put()
  async updateAddress(
    @Request() req,
    @Body()
    addressData: UpdateAddressDto,
  ) {
    try {
      const userId = req.user.userId;
      return await this.addressService.updateAddress(userId, addressData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to update address');
    }
  }

  @Delete()
  async deleteAddress(@Request() req) {
    const userId = req.user.userId;
    return this.addressService.deleteAddress(userId);
  }
}
