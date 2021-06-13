import { element } from 'protractor';
import { FriendsService } from '../../_services';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddElementComponent } from '../../_components/add-element/add-element.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bdays',
  templateUrl: './bdays.component.html',
  styleUrls: ['./bdays.component.less']
})

export class BdaysComponent implements OnInit, AfterViewInit {

  myList = [];
  displayedColumns: string[] = ['name', 'last_name', 'phone_number', 'birthday', 'city', 'actions'];

  dataSource;
  nameSearchValue: string;

  @ViewChild(MatSort) sort: MatSort;


  constructor(public dialog: MatDialog, private friendsService: FriendsService, private toastrService: ToastrService) {
    this.friendsService.getFriends().subscribe(friends => {
      this.myList = friends;
      this.dataSource = new MatTableDataSource(this.myList);
      this.dataSource.sort = this.sort;
    }, error => console.log(error));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  onDelete(row) {
    this.friendsService.deleteFriend(row).subscribe(result => {
      this.dataSource.data = this.myList;
      this.toastrService.success(`You deleted ${row.name} ${row.last_name}.`, 'Birthdays');
    }, error => console.log(error));
  }

  search()
  {
    if(this.nameSearchValue.length < 1)
    {
      this.nameSearchValue = "";
      this.dataSource = new MatTableDataSource(this.myList);
    }
    else
    {
      this.dataSource.data = this.myList.filter(e => e.name.toLowerCase().startsWith(this.nameSearchValue.toLocaleLowerCase()) || e.last_name.toLowerCase().startsWith(this.nameSearchValue.toLocaleLowerCase()));
    }
  }

  openAddDialog() {

    const dialogRef = this.dialog.open(AddElementComponent);

    dialogRef.afterClosed().subscribe(result => {

      if(result == undefined)
        return;

      if (!result.value)
        return;

      this.friendsService.addFriend(result.value).subscribe(data => {
        this.dataSource.data = this.myList;
        this.toastrService.success('You added a new friend into table', 'Birthdays');
      }, () => {
        this.toastrService.error('Error while adding a new friend', 'Birthdays');
      });

    });
  }

}
