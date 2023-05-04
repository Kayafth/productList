import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
}

@Component({
  selector: 'productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<{ products: Product[] }>('https://dummyjson.com/products')  //  burda ürünleri çekmek için free bir apiye istek atıldı
      .pipe(
        map(response => response.products),
        filter(products => !!products),
        map(products => {
          this.products = products;
          this.filteredProducts = products;
        })
      )
      .subscribe();
  }

  search(event: Event, searchText: string) {
    searchText = searchText.toLowerCase();
    if (!searchText) {
      this.products = this.filteredProducts;
    } else {
      this.products = this.filteredProducts.filter((product) => {
        return (
          product.title.toLowerCase().includes(searchText) ||
          product.description.toLowerCase().includes(searchText)
        );
      });
    }
  }
  
  onKeyUp(event: Event, searchText: string) {
    this.search(event, searchText);
  }
  
  formatPrice(price: number): string {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price).replace('₺', '');
  }
}
