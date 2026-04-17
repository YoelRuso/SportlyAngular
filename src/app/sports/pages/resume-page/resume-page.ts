import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';
import { HeroBanner } from '../../components/hero-banner/hero-banner';

@Component({
  selector: 'app-resume-page',
  imports: [Header, Footer, Navbar, HeroBanner ],
  templateUrl: './resume-page.html',
  styleUrl: './resume-page.css',
})
export default class ResumePage {}
