import { Component, OnInit, inject, signal } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SqliteService } from './sports/services/sqlite.service';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('SPORTLY');
  private readonly sqliteService = inject(SqliteService);

  ngOnInit(): void {
    void this.sqliteService.init();
  }
}
