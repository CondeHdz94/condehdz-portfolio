export interface SkillGroup {
  title: string
  items: string[]
}

export const SKILLS: SkillGroup[] = [
  {
    title: 'Languages',
    items: ['JavaScript', 'TypeScript', 'HTML', 'CSS / SASS'],
  },
  {
    title: 'Frameworks & Libraries',
    items: [
      'React', 'Zod', 'React Hook Form', 'React Query',
      'Redux', 'Zustand', 'Tailwind', 'Vite', 'React Router',
      'react-imask', 'Svelte', 'Astro', 'Framer Motion',
    ],
  },
  {
    title: 'Design & Motion',
    items: ['Figma', 'Illustrator', 'Photoshop', 'After Effects', 'Premiere Pro', 'InDesign'],
  },
  {
    title: 'Quality & Systems',
    items: ['Design Systems', 'Accessibility', 'Feature-Sliced Design', 'Git', 'Jest', 'Testing Library', 'Cypress'],
  },
]
