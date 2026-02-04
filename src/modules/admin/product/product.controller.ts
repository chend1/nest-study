import { Controller, Get } from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor() {}

  @Get('list')
  findAll() {}
}
