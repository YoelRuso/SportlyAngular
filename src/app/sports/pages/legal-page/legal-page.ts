import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { SidebarComponent } from '../../components/sidebar/sidebar';

interface LegalSection {
  id: string;
  title: string;
  content: string;
}

// Contenido embebido (migrar a Firebase en el futuro)
const LEGAL_DATA: LegalSection[] = [
  {
    id: 'aviso-legal',
    title: 'Aviso Legal',
    content: `<p>El acceso y la navegación por esta página implica la aceptación de todas las condiciones legales aquí descritas.</p>
<p>Los contenidos de esta web, incluyendo textos, imágenes, logotipos, gráficos y software, están protegidos por derechos de propiedad intelectual.</p>
<p>Queda prohibida su reproducción, distribución, comunicación pública o transformación sin autorización expresa de Sportly S.L.</p>
<p>El uso de esta página debe ser adecuado y conforme a la ley, sin fines ilícitos o que puedan dañar la reputación de la empresa.</p>
<p>Sportly no se hace responsable de los daños o perjuicios derivados del uso indebido de la información contenida en esta web.</p>
<p>Cualquier enlace a sitios de terceros no implica respaldo ni responsabilidad por sus contenidos.</p>`,
  },
  {
    id: 'privacidad',
    title: 'Política de Privacidad',
    content: `<p>En Sportly nos tomamos muy en serio la protección de tus datos personales. Recopilamos información únicamente con fines relacionados con la prestación de nuestros servicios y la mejora de la experiencia de usuario.</p>
<p>No compartimos tus datos con terceros sin tu consentimiento explícito, salvo obligaciones legales o administrativas que lo requieran.</p>
<p>Utilizamos medidas de seguridad técnicas y organizativas para proteger la información frente a accesos no autorizados, pérdida o manipulación de datos.</p>
<p>Tienes derecho a acceder, rectificar y eliminar tus datos personales, así como a retirar tu consentimiento cuando lo desees.</p>
<p>Los datos que nos facilites se conservarán solo durante el tiempo necesario para cumplir con los fines para los que fueron recopilados.</p>
<p>En caso de duda o consulta sobre el tratamiento de tus datos, puedes ponerte en contacto con nosotros a través de los medios disponibles en esta web.</p>
<p>El uso continuado de nuestros servicios implica la aceptación de esta política de privacidad.</p>`,
  },
  {
    id: 'cookies',
    title: 'Política de Cookies',
    content: `<p>Esta web utiliza cookies para mejorar la experiencia de navegación y personalizar los contenidos mostrados. Las cookies nos permiten analizar el tráfico y funcionamiento del sitio.</p>
<p>Puedes aceptar o rechazar las cookies mediante las opciones que te proporciona tu navegador. También puedes configurarlas para que se eliminen automáticamente al cerrar la sesión.</p>
<p>No se recopilan datos personales mediante cookies sin tu consentimiento previo. Toda información recogida se utiliza únicamente con fines analíticos y de mejora del sitio.</p>
<p>Al continuar navegando, aceptas el uso de cookies según la presente política. Si decides no aceptar, algunas funcionalidades del sitio podrían no estar disponibles.</p>
<p>Las cookies de terceros pueden instalarse en nuestra web para fines publicitarios o de medición de audiencias. No tenemos control sobre estas cookies.</p>
<p>Para más información, consulta la sección de ayuda de tu navegador o contacta con nosotros para cualquier duda sobre nuestras cookies.</p>`,
  },
  {
    id: 'accesibilidad',
    title: 'Declaración de Accesibilidad',
    content: `<p>Sportly S.L. se compromete a garantizar que su sitio web sea accesible para todas las personas, incluidas aquellas con discapacidad.</p>
<p>Hemos implementado medidas de accesibilidad siguiendo los estándares internacionales y las pautas WCAG 2.1 nivel AA, siempre que es técnicamente posible.</p>
<p>Se proporciona navegación clara, texto alternativo para imágenes, contraste suficiente, y compatibilidad con lectores de pantalla.</p>
<p>Algunas secciones pueden presentar limitaciones debido a contenido externo o a restricciones técnicas de ciertos navegadores.</p>
<p>Se revisa periódicamente la accesibilidad del sitio, con el objetivo de identificar y corregir posibles barreras de uso.</p>
<p>Si detectas dificultades para acceder a algún contenido o funcionalidad, puedes contactarnos y nos comprometemos a ofrecer una alternativa.</p>`,
  },
];

@Component({
  selector: 'app-legal-page',
  imports: [CommonModule, Header, Footer, SidebarComponent],
  templateUrl: './legal-page.html',
  styleUrl: './legal-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LegalPage implements OnInit {
  sections = LEGAL_DATA;
  active: LegalSection = LEGAL_DATA[0];
  sidebarOpen = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      const found = this.sections.find((s) => s.id === fragment);
      if (found) this.active = found;
      this.sidebarOpen = false;
      this.cdr.markForCheck();
    });
  }

  select(section: LegalSection): void {
    this.active = section;
    this.sidebarOpen = false;
    this.cdr.markForCheck();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.cdr.markForCheck();
  }
}
