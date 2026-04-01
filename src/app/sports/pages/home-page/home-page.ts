import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { HeroBanner } from '../../components/hero-banner/hero-banner';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-home-page',
  imports: [Header, HeroBanner, Navbar],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export default class HomePage {}
