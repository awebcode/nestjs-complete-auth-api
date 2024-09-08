import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CustomParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const intValue = parseInt(value, 10);

    if (isNaN(intValue)) {
      throw new BadRequestException(`Invalid ID: '${value}' is not a number.`);
    }

    return intValue;
  }
}
