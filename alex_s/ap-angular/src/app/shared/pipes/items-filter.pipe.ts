import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'itemsFilter' })
export class ItemsFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase();

    return items.filter(item => {
      let test = false;

      Object.keys(item).map(key => {
        const field = item[key];

        if (key === 'name' || key === 'surname' || key === 'email' || key === 'occupation' || key === 'title') {
          if (field.toLocaleLowerCase().includes(searchText)) {
            test = true;
          }
        }
      });

      return test;
    });
  }
}
