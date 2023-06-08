import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

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

  getCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      console.log(data);
      this.processCategoryResponse(data);
    });
  }

  processCategoryResponse(resp: any) {

    const dataCategory: CategoryElement[] = [];

    if(resp.metadata[0].code == "00"){
      let listCategory = resp.categoryResponse.category;
      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      }
      );
      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
    }
    
  }

  openCateryDialog() {
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
