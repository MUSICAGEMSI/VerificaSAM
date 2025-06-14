// scripts/generateExperiences.js
const fs = require('fs');
const path = require('path');

// Função para buscar dados dos cursos (pode ser expandida para buscar da API)
async function fetchCursosData() {
  try {
    // Para build time, você pode usar dados estáticos ou fazer fetch da API
    // Se quiser fazer fetch da API durante o build, descomente as linhas abaixo:
    
    /*
    const fetch = require('node-fetch'); // Instale: npm install node-fetch
    const response = await fetch('https://script.google.com/macros/s/SEU_SCRIPT_ID/exec');
    if (response.ok) {
      return await response.json();
    }
    */
    
    // Por enquanto, retorna dados de exemplo para não quebrar o build
    return {
      "Jardim Aline": [{
        localidade: "Jardim Aline",
        curso: "TEORIA MUSICAL",
        nomenclatura: "TURMA 02 - TEORIA E SOLFEJO MSA - INSTRUTOR RESPONSÁVEL: ELIEZER VIEIRA",
        matriculados: 4,
        inicio: "11/08/2023",
        termino: "11/08/2026",
        dia: "SEX",
        hora: "20:00 ÀS 21:00",
        pendente: ["28-mar", "25-abr", "23-mai", "30-mai", "06-jun"],
        irregular: ["28-mar", "25-abr", "23-mai", "30-mai", "06-jun"]
      }],
      "Jardim Amanda I": [{
        localidade: "Jardim Amanda I",
        curso: "TUBA",
        nomenclatura: "TURMA 03 - TEORIA E SOLFEJO MSA - INSTRUTOR RESPONSÁVEL: AYRTON ALBERTO & JOSE CARLOS ALEIXO",
        matriculados: 1,
        inicio: "01/07/2024",
        termino: "31/12/2025",
        dia: "QUA",
        hora: "19:30 ÀS 21:00",
        pendente: ["05-fev", "12-fev", "19-fev", "26-fev", "05-mar", "12-mar", "19-mar", "26-mar", "02-abr", "09-abr", "16-abr", "23-abr", "30-abr", "14-mai", "21-mai", "28-mai", "04-jun"],
        irregular: ["05-fev", "12-fev", "19-fev", "26-fev", "05-mar", "12-mar", "19-mar", "26-mar", "02-abr", "09-abr", "16-abr", "23-abr", "30-abr", "14-mai", "21-mai", "28-mai", "04-jun"]
      }]
    };
  } catch (error) {
    console.warn('Erro ao buscar dados dos cursos durante o build:', error.message);
    return {};
  }
}

async function generateExperiences() {
  try {
    console.log('🔄 Gerando dados de experiências...');
    
    const cursosData = await fetchCursosData();
    
    // Gera o arquivo de experiências existente (mantém o formato original)
    const experiencesContent = `// Este arquivo é gerado automaticamente
// Não edite manualmente - será sobrescrito no próximo build

export const experiences = [
  {
    title: "AI/ML Intern",
    company_name: "EduSkill Foundation | AWS Academy | AICTE",
    icon: "eduskill", // Importado no index.js
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
    icon: "mathwork", // Importado no index.js
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
    icon: "edunet", // Importado no index.js
    iconBg: "#161329",
    date: "June 2023 - July 2023",
    points: [
      "Engineered a comprehensive Mental Health Fitness Tracker ML model utilizing Python and scikit-learn.",
      "Maximized the model's performance by refining model parameters and employing ensemble methods, yielding an outstanding accuracy percentage of 98.50%.",
      "Leveraged 12 regression algorithms to attain precise outcomes in analyzing and predicting mental fitness levels across 150+ countries.",
    ],
  },
];

// Dados dos cursos (atualizados dinamicamente)
export const cursosData = ${JSON.stringify(cursosData, null, 2)};

// Metadados dos cursos
export const cursosMetadata = {
  lastGenerated: "${new Date().toISOString()}",
  totalLocalidades: ${Object.keys(cursosData).length},
  totalCursos: ${Object.values(cursosData).flat().length},
  totalMatriculados: ${Object.values(cursosData).flat().reduce((total, curso) => total + (curso.matriculados || 0), 0)}
};
`;

    // Cria o diretório se não existir
    const constantsDir = path.join(process.cwd(), 'src', 'constants');
    if (!fs.existsSync(constantsDir)) {
      fs.mkdirSync(constantsDir, { recursive: true });
    }

    // Escreve o arquivo
    const filePath = path.join(constantsDir, 'experiences.js');
    fs.writeFileSync(filePath, experiencesContent, 'utf8');
    
    console.log('✅ Arquivo de experiências gerado com sucesso!');
    console.log(`📁 Local: ${filePath}`);
    console.log(`📊 Cursos processados: ${Object.values(cursosData).flat().length}`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar experiências:', error);
    process.exit(1);
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  generateExperiences();
}

module.exports = { generateExperiences, fetchCursosData };