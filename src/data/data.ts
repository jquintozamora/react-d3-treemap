import { TreeMapInPutData } from "../App/App"

export const data: TreeMapInPutData = {
  id: 1,
  name: "Documents",
  children: [
    {
      id: 2,
      name: "React",
      value: 300,
      link: "https://blog.josequinto.com",
    },
    {
      id: 3,
      name: "PHP",
      children: [
        { id: 4, name: "PHP 1.1", value: 12 },
        { id: 5, name: "PHP 1.2", value: 20 },
        { id: 6, name: "PHP 1.3", value: 30 },
        { id: 7, name: "PHP 1.4", value: 73 },
        { id: 8, name: "PHP 2.1", value: 30 },
        { id: 9, name: "PHP 2.2", value: 43 },
        { id: 10, name: "PHP 2.3", value: 10 },
        { id: 11, name: "PHP 2.4", value: 3 },
      ],
    },
    {
      id: 12,
      name: "Python",
      children: [
        { id: 13, name: "Python 1.1", value: 12 },
        {
          id: 14,
          name: "Python 1.2",
          children: [
            { id: 15, name: "Python 1.2.1", value: 12 },
            { id: 16, name: "Python 1.2.2", value: 20 },
            { id: 17, name: "Python 1.2.3", value: 30 },
            { id: 18, name: "Python 1.2.4", value: 73 },
          ],
        },
        { id: 19, name: "Python 1.3", value: 300 },
        { id: 20, name: "Python 1.4", value: 743 },
      ],
    },
    { id: 21, name: "C#", value: 500 },
    { id: 22, name: "Rust", value: 300 },
    {
      id: 23,
      name: "C",
      children: [
        { id: 24, name: "C++ 1.1", value: 12 },
        { id: 25, name: "C++ 1.2", value: 200 },
        { id: 26, name: "C++ 1.3", value: 300 },
        { id: 27, name: "C++ 1.4", value: 743 },
      ],
    },
    {
      id: 28,
      name: "JavaScript",
      link: "https://blog.josequinto.com",
      children: [
        { id: 29, name: "TypeScript 1.1", value: 12 },
        { id: 30, name: "TypeScript 1.2", value: 200 },
        { id: 31, name: "TypeScript 1.3", value: 300 },
        { id: 32, name: "TypeScript 1.4", value: 743 },
      ],
    },
  ],
}
