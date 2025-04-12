import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'user-management-fe';
}
