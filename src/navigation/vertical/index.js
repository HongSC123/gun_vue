import ref from './ref'

export default [
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'mdi-home-outline' },
  },
  {
    title: 'Second page',
    to: { name: 'second-page' },
    icon: { icon: 'mdi-file-document-outline' },
  },
  ...ref,
]
