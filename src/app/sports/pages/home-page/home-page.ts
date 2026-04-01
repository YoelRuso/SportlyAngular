import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-home-page',
  imports: [Header, Navbar],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export default class HomePage {}
