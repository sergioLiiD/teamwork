import { nanoid } from 'nanoid';

export const hivacoSalesTemplate = {
  id: nanoid(),
  name: 'Bienvenida a Vendedores Hivaco',
  description: 'Proceso de incorporación para nuevos vendedores de Hivaco',
  type: 'sales',
  steps: [
    {
      id: nanoid(),
      title: 'Bienvenida e Introducción',
      description: 'Introducción a Hivaco y nuestro equipo de ventas',
      type: 'video',
      content: {
        text: 'Bienvenido al equipo de ventas de Hivaco. Este video te introducirá a nuestra cultura, valores y tu rol en la organización.',
        videoUrl: 'https://example.com/hivaco-welcome',
        documents: ['Manual_Bienvenida_Hivaco.pdf']
      },
      dueInDays: 1,
      assignees: ['mentor@hivaco.com'],
      status: 'pending'
    },
    {
      id: nanoid(),
      title: 'Políticas y Procedimientos',
      description: 'Revisión de políticas importantes de la empresa',
      type: 'document',
      content: {
        text: 'Por favor revisa nuestras políticas y procedimientos cuidadosamente.',
        documents: [
          'Politicas_Ventas_Hivaco.pdf',
          'Codigo_Conducta_Hivaco.pdf',
          'Manual_Procedimientos.pdf'
        ],
        todos: [
          { text: 'Leer Manual de Políticas', required: true },
          { text: 'Revisar Código de Conducta', required: true },
          { text: 'Firmar Acuerdo de Confidencialidad', required: true }
        ]
      },
      dueInDays: 2,
      assignees: ['rh@hivaco.com'],
      status: 'pending'
    },
    {
      id: nanoid(),
      title: 'Capacitación en Productos',
      description: 'Conoce nuestra línea de productos y servicios',
      type: 'video',
      content: {
        videoUrl: 'https://example.com/hivaco-products',
        text: 'Completa el entrenamiento sobre nuestra línea de productos.',
        documents: ['Catalogo_Productos.pdf', 'Especificaciones_Tecnicas.pdf'],
        todos: [
          { text: 'Ver video de productos', required: true },
          { text: 'Revisar catálogo completo', required: true },
          { text: 'Completar práctica de especificaciones', required: true }
        ]
      },
      dueInDays: 3,
      assignees: ['capacitacion@hivaco.com'],
      status: 'pending'
    },
    {
      id: nanoid(),
      title: 'Evaluación de Productos',
      description: 'Demuestra tu conocimiento de nuestros productos',
      type: 'quiz',
      content: {
        quiz: {
          questions: [
            {
              question: '¿Cuál es nuestro producto estrella?',
              options: ['Producto A', 'Producto B', 'Producto C', 'Producto D'],
              correctAnswer: 'Producto A'
            },
            {
              question: '¿Cuáles son las características principales del Producto B?',
              options: [
                'Características 1, 2, 3',
                'Características 2, 3, 4',
                'Características 3, 4, 5',
                'Características 4, 5, 6'
              ],
              correctAnswer: 'Características 1, 2, 3'
            }
          ]
        }
      },
      dueInDays: 5,
      assignees: ['evaluacion@hivaco.com'],
      status: 'pending'
    },
    {
      id: nanoid(),
      title: 'Proceso de Ventas',
      description: 'Aprende nuestro proceso y metodología de ventas',
      type: 'document',
      content: {
        text: 'Revisa nuestra metodología de ventas y completa la lista de verificación.',
        documents: ['Metodologia_Ventas_Hivaco.pdf'],
        todos: [
          { text: 'Revisar etapas de venta', required: true },
          { text: 'Completar simulación de venta', required: true },
          { text: 'Configurar herramientas de venta', required: true }
        ]
      },
      dueInDays: 7,
      assignees: ['ventas@hivaco.com'],
      status: 'pending'
    },
    {
      id: nanoid(),
      title: 'Herramientas y Sistemas',
      description: 'Configuración y capacitación en nuestras herramientas',
      type: 'checklist',
      content: {
        text: 'Configura y aprende a usar nuestras herramientas de ventas.',
        todos: [
          { text: 'Configurar cuenta de CRM', required: true },
          { text: 'Completar tutorial de CRM', required: true },
          { text: 'Configurar correo electrónico', required: true },
          { text: 'Instalar aplicaciones necesarias', required: true }
        ]
      },
      dueInDays: 4,
      assignees: ['sistemas@hivaco.com'],
      status: 'pending'
    }
  ]
};

export const workflowTemplates = [hivacoSalesTemplate];