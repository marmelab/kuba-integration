import { PipeTransform, Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class RangePipe implements PipeTransform {
  transform(range: any) {
    if (range) {
      try {
        const rangeNumber = JSON.parse(range) as number[];
        if (rangeNumber) {
          return {
            take: rangeNumber[1] - rangeNumber[0],
            skip: rangeNumber[0],
          };
        }
      } catch (e) {
        throw new HttpException('Incorrect range parameter', 400);
      }
    }

    return undefined;
  }
}

@Injectable()
export class SortPipe implements PipeTransform {
  transform(sort: any) {
    if (sort) {
      try {
        const sortParsed = JSON.parse(sort);
        if (sortParsed) {
          return {
            orderBy: {
              [sortParsed[0]]: sortParsed[1].toLowerCase(),
            },
          };
        }
      } catch (e) {
        throw new HttpException('Incorrect sort parameter', 400);
      }
    }

    return undefined;
  }
}

@Injectable()
export class FilterUserPipe implements PipeTransform {
  transform(filter: any) {
    if (filter) {
      try {
        const filters = JSON.parse(filter);
        if (filters.email) {
          return {
            where: {
              email: {
                contains: filters.email,
              },
            },
          };
        }
      } catch (e) {
        throw new HttpException('Incorrect filter parameter', 400);
      }
    }

    return undefined;
  }
}
