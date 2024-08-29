import ProjectCanvas from "../views/pages/project-canvas";

const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/project-canvas', exact: true, component: ProjectCanvas, name: 'Create project' },
];

export default routes;