# SPORTLY

## Instalation
```
npm install @angular/fire --legacy-peer-deps
npm install @ionic/angular ionicons --legacy-peer-deps
npm install @ionic/angular-toolkit --save-dev --legacy-peer-deps
npm install @capacitor-community/sqlite --legacy-peer-deps
npm install jeep-sqlite sql.js --legacy-peer-deps
```

### Sqlite3 instalation
Linux
```
sudo apt install sqlite3
```

# 📁 Configuración de Firebase para el Equipo

La base de datos de Firestore ya está configurada y con los datos cargados. Para poder trabajar localmente y que la aplicación se conecte correctamente, sigue estos pasos:

## 1. Obtener tu llave de acceso local
Debido a que las credenciales son privadas, cada uno debe tener su propio archivo de acceso que el `.gitignore` ignorará automáticamente:

1. Entra a la [Consola de Firebase](https://console.firebase.google.com/) y selecciona el proyecto **Sportly**.
2. Ve a **Configuración del proyecto** (engranaje) > **Cuentas de servicio**.
3. Haz clic en el botón **Generar nueva clave privada**.
4. Descarga el archivo `.json`.

## 2. Configuración en el proyecto
1. Copia el archivo JSON descargado en la **raíz del proyecto** (donde está el `package.json`).
2. Cámbiale el nombre a: `firebase-key.json`.
  * *Nota: Es muy importante que el nombre sea exacto para que el `.gitignore` lo detecte y no lo subas a GitHub por error.*

## 3. Verificación
Una vez que tengas el archivo en tu carpeta, al levantar el proyecto (`ng serve` o el comando que uses), la aplicación debería poder consultar los datos de Firestore automáticamente.

---
⚠️ **SEGURIDAD:** Nunca borres la línea `firebase-key.json` de tu archivo `.gitignore`. Si GitHub te avisa de un "Secret Detection", no fuerces el push.

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Android / Capacitor

This project is prepared to run in Android Studio through Capacitor.

1. Install the native dependencies:

```bash
npm install
```

2. Generate or sync the Android platform:

```bash
npm run android:sync
```

3. Open the native project in Android Studio:

```bash
npm run android:open
```

The web build output used by Capacitor is `dist/SPORTLY/browser`.
