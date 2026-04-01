import { Component } from '@angular/core';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-home-page',
  imports: [Header],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export default class HomePage {}
