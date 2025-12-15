import styles from "./App.module.scss";
import { Button, Input, Loader } from "./components/ui";

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Форма пошуку турів</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.searchForm}>
          <div className={styles.inputGroup}>
            <Input placeholder="цкрана" />
          </div>

          <div className={styles.buttonGroup}>
            <Button>Знайти</Button>
          </div>
        </div>

        <div className={styles.loaderSection}>
          <Loader text="Завантаження..." />
        </div>
      </main>
    </div>
  );
}

export default App;
