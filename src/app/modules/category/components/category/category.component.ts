import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  constructor(private categoryService: CategoryService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCategories();
  }

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;


  //obtenemos las categorias
  getCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      console.log(data);
      this.processCategoryResponse(data);
    });
  }


  //procesamos la respuesta de las categorias
  processCategoryResponse(resp: any) {

    const dataCategory: CategoryElement[] = [];

    if(resp.metadata[0].code == "00"){
      let listCategory = resp.categoryResponse.category;
      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      }
      );
      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      this.dataSource.paginator = this.paginator;
    }
    
  }

  //abrimos el dialogo para agregar una nueva categoria
  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px'});
    
    dialogRef.afterClosed().subscribe(result => {

      if(result == 1){
        this.openSnackBar('Categoria agregada', 'OK');
        this.getCategories();
      }else if(result == 2){
        this.openSnackBar('Error al agregar categoria', 'Error');
      }      
    });
  }


  //abrimos el dialogo para editar una categoria
  edit(id: number, name: string, description: string) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data: {id: id, name: name, description: description}});
    
    dialogRef.afterClosed().subscribe(result => {

      if(result == 1){
        this.openSnackBar('Categoria actualizada', 'OK');
        this.getCategories();
      }else if(result == 2){
        this.openSnackBar('Error al actualizar categoria', 'Error');
      }      
    });
  }

  //eliminamos una categoria
  delete(id: number) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      
      data: {id: id, module: "category"}});
    
    dialogRef.afterClosed().subscribe(result => {

      if(result == 1){
        this.openSnackBar('Categoria eliminada', 'OK');
        this.getCategories();
      }else if(result == 2){
        this.openSnackBar('Error al eliminar categoria', 'Error');
      }      
    });
  }

  buscar(termino: string) {
    if(termino.length === 0){
      return this.getCategories();
    }
    this.categoryService.getCategorieById(termino).subscribe((resp) => {
      
      this.processCategoryResponse(resp);
    }
    );
  }

  
  //Snackbar para mostrar mensajes de error o exito
  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}

export interface CategoryElement {
  id: number;
  name: string;
  description: string;
}
