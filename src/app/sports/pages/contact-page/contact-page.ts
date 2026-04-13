import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-contact-page',
  imports: [Header, Footer],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
})
export default class ContactPage {}
