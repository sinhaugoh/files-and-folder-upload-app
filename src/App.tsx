import "./App.css";
import { Dropzone } from "./components/Dropzone";

function App() {
  return (
    <div>
      <div className="mx-auto mt-10 h-72 max-w-[50rem] border border-dotted border-black">
        <Dropzone />
      </div>
    </div>
  );
}

export default App;
