export const data = {
  name: "Documents",
  children: [
    {
      name: "React",
      value: 300,
      link: "https://blog.josequinto.com",
    },
    {
      name: "PHP",
      children: [
        { name: "PHP 1.1", value: 12 },
        { name: "PHP 1.2", value: 20 },
        { name: "PHP 1.3", value: 30 },
        { name: "PHP 1.4", value: 73 },
        { name: "PHP 2.1", value: 30 },
        { name: "PHP 2.2", value: 43 },
        { name: "PHP 2.3", value: 10 },
        { name: "PHP 2.4", value: 3 },
      ],
    },
    {
      name: "Python",
      children: [
        { name: "Python 1.1", value: 12 },
        {
          name: "Python 1.2",
          children: [
            { name: "Python 1.2.1", value: 12 },
            { name: "Python 1.2.2", value: 20 },
            { name: "Python 1.2.3", value: 30 },
            { name: "Python 1.2.4", value: 73 },
          ],
        },
        { name: "Python 1.3", value: 300 },
        { name: "Python 1.4", value: 743 },
      ],
    },
    { name: "C#", value: 500 },
    { name: "Rust", value: 300 },
    {
      name: "C",
      children: [
        { name: "C++ 1.1", value: 12 },
        { name: "C++ 1.2", value: 200 },
        { name: "C++ 1.3", value: 300 },
        { name: "C++ 1.4", value: 743 },
      ],
    },
    {
      name: "JavaScript",
      link: "https://blog.josequinto.com",
      children: [
        { name: "TypeScript 1.1", value: 12 },
        { name: "TypeScript 1.2", value: 200 },
        { name: "TypeScript 1.3", value: 300 },
        { name: "TypeScript 1.4", value: 743 },
      ],
    },
  ],
}
