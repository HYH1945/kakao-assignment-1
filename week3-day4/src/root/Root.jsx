import ComponentPractice from "@/component_practice/App";
import Demo01 from "@/demo/01_lifting/App";
import Demo02 from "@/demo/02_loading/App";
import Demo03 from "@/demo/03_custom_hook/App";
import BlogPage from "@/tailwind_practice/App";

const view = new URLSearchParams(window.location.search).get("view");

export default function Root() {
  return (
    <>
      <nav className="mode-nav">
        <a href="/"               className={!view ? "active" : ""}>실습</a>
        <a href="?view=tailwind"  className={view === "tailwind" ? "active" : ""}>Tailwind</a>
        <a href="?view=demo1"     className={view === "demo1" ? "active" : ""}>시연 1</a>
        <a href="?view=demo2"     className={view === "demo2" ? "active" : ""}>시연 2</a>
        <a href="?view=demo3"     className={view === "demo3" ? "active" : ""}>시연 3</a>
      </nav>
      {!view               && <ComponentPractice />}
      {view === "tailwind" && <BlogPage />}
      {view === "demo1"    && <Demo01 />}
      {view === "demo2"    && <Demo02 />}
      {view === "demo3"    && <Demo03 />}
    </>
  );
}
