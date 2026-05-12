import React from 'react';

const techStack = [
  { name: 'AWS', icon: '☁️' },
  { name: 'Kubernetes', icon: '⎈' },
  { name: 'Docker', icon: '🐳' },
  { name: 'React', icon: '⚛️' },
  { name: 'Python', icon: '🐍' },
  { name: 'TensorFlow', icon: '🧠' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'Redis', icon: '⚡' },
  { name: 'GraphQL', icon: '◈' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Node.js', icon: '⬢' },
  { name: 'Terraform', icon: '🏗️' },
];

const TechMarquee: React.FC = () => {
  return (
    <div className="ml-tech-marquee">
      <div className="ml-tech-track">
        {[...techStack, ...techStack].map((tech, i) => (
          <div key={i} className="ml-tech-item">
            <span className="ml-tech-icon">{tech.icon}</span>
            <span>{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechMarquee;
