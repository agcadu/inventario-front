import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  displayedColumns: string[] = ['id', 'name', 'price','stock','category','picture', 'actions'];
  dataSource = new MatTableDataSource<ProductElerment>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  //obtenemos los productos
  getProducts() {
    this.productService.getProducts().subscribe((data) => {
      console.log("respuesta de productos: ",data);
      this.processProductResponse(data);      
    });
  }

  processProductResponse(resp: any) {
      
      const dataProduct: ProductElerment[] = [];
  
      if(resp.metadata[0].code == "00"){
        let listProduct = resp.product.products;
        listProduct.forEach((element: ProductElerment) => {
          element.category = element.category.name;
          element.picture = 'data:image/jpg;base64,' + element.picture;
          dataProduct.push(element);          
        }
        );
        this.dataSource = new MatTableDataSource<ProductElerment>(dataProduct);
        this.dataSource.paginator = this.paginator;
      }
      
    }

}

export interface ProductElerment {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: any;
  picture: any;
}
