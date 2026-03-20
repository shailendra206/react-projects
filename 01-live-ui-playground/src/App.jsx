import styles from "./App.module.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Sidebar from "./components/layout/Sidebar";
import Playground from "./components/playground/Playground";
import CodePanel from "./components/code-panel/CodePanel";
import { PlaygroundProvider } from "./context/PlaygroundContext";

function App() {
  return (
    <PlaygroundProvider>
      <Header />

      <div className={styles.middle}>
        <main className={styles.main}>
          <Sidebar />
          <Playground />
        </main>

        <CodePanel />
      </div>

      <Footer />
    </PlaygroundProvider>
  );
}

export default App;
