import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { NewProductComponent } from '../new-product/new-product.component';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private productService: ProductService, 
    public dialog: MatDialog, private snackBar: MatSnackBar) { }

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
         //element.category = element.category.name;
          element.picture = 'data:image/jpg;base64,' + element.picture;
          dataProduct.push(element);          
        }
        );
        this.dataSource = new MatTableDataSource<ProductElerment>(dataProduct);
        this.dataSource.paginator = this.paginator;
      }
      
    }

    openProductDialod() {
      const dialogRef = this.dialog.open(NewProductComponent, {
        width: '450px'});
      
      dialogRef.afterClosed().subscribe(result => {
  
        if(result == 1){
          this.openSnackBar('Producto agregado', 'OK');
          this.getProducts();
        }else if(result == 2){
          this.openSnackBar('Error al agregar producto', 'Error');
        }      
      });
    }

    openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar> {
      return this.snackBar.open(message, action, {
        duration: 2000,
      });
    }

    edit(id:number, name:string, price:number, stock:number, category:any){
      
      const dialogRef = this.dialog.open(NewProductComponent, {
        width: '450px',
        data: {id: id, name: name, price: price, stock: stock, category: category}
      });
      
      dialogRef.afterClosed().subscribe(result => {
  
        if(result == 1){
          this.openSnackBar('Producto editado', 'OK');
          this.getProducts();
        }else if(result == 2){
          this.openSnackBar('Error al editar producto', 'Error');
        }      
      });
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
