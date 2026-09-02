import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Görevler alınamadı");
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Görevler alınamadı");
        }

        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setTasks(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Görev eklenemedi");
      }

      setForm({
        title: "",
        description: "",
      });

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Görev güncellenemedi");
      }

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Görev silinemedi");
      }

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <header>
        <p className="eyebrow">Beş Container Projesi</p>
        <h1>Görev Yönetimi</h1>
        <p>Spring Boot, React, MySQL, Redis ve Nginx</p>
      </header>

      <section className="card">
        <h2>Yeni görev</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Başlık</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength="100"
            required
          />

          <label htmlFor="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength="500"
            rows="3"
          />

          <button type="submit">Görev ekle</button>
        </form>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="card">
        <div className="list-heading">
          <h2>Görevler</h2>
          <span>{tasks.length} görev</span>
        </div>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : tasks.length === 0 ? (
          <p>Henüz görev bulunmuyor.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className={task.completed ? "completed" : ""}
              >
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>

                <div className="actions">
                  <button
                    className="secondary"
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.completed ? "Geri al" : "Tamamla"}
                  </button>

                  <button
                    className="danger"
                    onClick={() => deleteTask(task.id)}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
