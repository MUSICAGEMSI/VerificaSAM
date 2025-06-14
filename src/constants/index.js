// src/constants/cursos.js
// Novo arquivo para gerenciar os dados dos cursos

class CursosManager {
  constructor() {
    this.data = {};
    this.lastFetch = null;
    this.SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyC08Khwn8QgNIyk86gU8LnkUCRwy0hMvXCM1O-N3VH00rKTMIFMoO2oeKQMC8PEaQ3/exec';
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  }

  async fetchCursos() {
    try {
      const response = await fetch(this.SCRIPT_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.data = data;
      this.lastFetch = Date.now();
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados dos cursos:', error);
      throw error;
    }
  }

  async getCursos(forceRefresh = false) {
    const needsRefresh = !this.lastFetch || 
                        (Date.now() - this.lastFetch) > this.CACHE_DURATION ||
                        forceRefresh;

    if (needsRefresh) {
      await this.fetchCursos();
    }

    return this.data;
  }

  // Métodos utilitários
  getLocalidades() {
    return Object.keys(this.data);
  }

  getCursosByLocalidade(localidade) {
    return this.data[localidade] || [];
  }

  getTotalMatriculados() {
    return Object.values(this.data)
      .flat()
      .reduce((total, curso) => total + (curso.matriculados || 0), 0);
  }

  getTotalCursos() {
    return Object.values(this.data)
      .flat()
      .length;
  }

  getCursosComPendencias() {
    return Object.values(this.data)
      .flat()
      .filter(curso => 
        (curso.pendente && curso.pendente.length > 0) ||
        (curso.irregular && curso.irregular.length > 0)
      );
  }
}

// Instância singleton
export const cursosManager = new CursosManager();

// Para compatibilidade com o sistema existente
export const getCursosData = () => cursosManager.getCursos();

// Hook personalizado para React (se estiver usando)
export const useCursos = () => {
  const [cursos, setCursos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshCursos = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cursosManager.getCursos(forceRefresh);
      setCursos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCursos();
    
    // Auto-refresh a cada 5 minutos
    const interval = setInterval(() => refreshCursos(), 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { cursos, loading, error, refreshCursos };
};

// Atualização do seu index.js existente
// src/constants/index.js

import {
  c,
  python,
  java,
  cpp,
  javascript,
  html,
  css,
  reactjs,
  tailwind,
  nodejs,
  git,
  edunet,
  weatherpedia,
  termpw,
  payloadmaster,
  threejs,
  mhft,
  sketcher,
  mathwork,
  CompileVortex,
  eduskill,
} from "../assets";

// Importa o gerenciador de cursos
import { cursosManager } from "./cursos";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
  // Adiciona link para cursos se necessário
  {
    id: "cursos",
    title: "Cursos",
  },
];

export const services = [
  { title: "C", icon: c },
  { title: "C++", icon: cpp },
  { title: "Python", icon: python },
  { title: "Java", icon: java },
];

export const technologies = [
  { name: "HTML 5", icon: html },
  { name: "CSS 3", icon: css },
  { name: "JavaScript", icon: javascript },
  { name: "React JS", icon: reactjs },
  { name: "Tailwind CSS", icon: tailwind },
  { name: "Node JS", icon: nodejs },
  { name: "Three JS", icon: threejs },
  { name: "git", icon: git },
];

// Mantém as experiences existentes
export const experiences = [
  {
    title: "AI/ML Intern",
    company_name: "EduSkill Foundation | AWS Academy | AICTE",
    icon: eduskill,
    iconBg: "#161329",
    date: "Sep 2023 - Nov 2023",
    points: [
      "VerificaSAM",
      "also gaining a solid foundation in Machine Learning, covering topics like algorithms, data analysis, and model building.",
    ],
  },
  {
    title: "Mathwork Ai Virtual Intern",
    company_name: "Mathwork | AICTE",
    icon: mathwork,
    iconBg: "#161329",
    date: "May 2023 - Sep 2023",
    points: [
      "Completed virtual internship, gaining a strong foundation in MATLAB, including data analysis and processing.",
      "Acquired practical skills in image and signal processing, including segmentation, batch processing, and spectral analysis.",
      "Developed expertise in machine learning models for clustering, classification, and regression, and customized deep learning techniques for image classification.",
    ],
  },
  {
    title: "Artificial Intelligence Intern",
    company_name: "Edunet Foundation | IBM SkillsBuild | AICTE",
    icon: edunet,
    iconBg: "#161329",
    date: "June 2023 - July 2023",
    points: [
      "Engineered a comprehensive Mental Health Fitness Tracker ML model utilizing Python and scikit-learn.",
      "Maximized the model's performance by refining model parameters and employing ensemble methods, yielding an outstanding accuracy percentage of 98.50%.",
      "Leveraged 12 regression algorithms to attain precise outcomes in analyzing and predicting mental fitness levels across 150+ countries.",
    ],
  },
];

export const projects = [
  {
    name: "WeatherPedia",
    description:
      "Web-based platform that allows users to access weather information for their location by entering it in the search field",
    tags: [
      { name: "Javascript", color: "blue-text-gradient" },
      { name: "HTML", color: "green-text-gradient" },
      { name: "bootstrap 5.3.0", color: "pink-text-gradient" },
      { name: "Weather API by API Ninjas", color: "yellow-text-gradient" },
    ],
    image: weatherpedia,
    source_code_link: "https://github.com/lohitkolluri/WeatherPedia",
  },
  // ... outros projetos existentes
];

// Exporta o gerenciador de cursos para uso em componentes
export { cursosManager };
