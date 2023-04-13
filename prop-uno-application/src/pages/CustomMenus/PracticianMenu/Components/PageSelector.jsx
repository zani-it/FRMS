import "./PageSelector.scss";

function PageSelector() {
  return (
    <div className="page-selector__menu">
      <div>
        {" "}
        <h1>FRMS<br/>(Fast Registry Management System)</h1>{" "}
      </div>
      <div className="page-selector__wrapper">
        <div>
          <button
            className="page-selector__button"
            onClick={() => {
              window.open("/patient-details", "_blank");
            }}
          >
            Patien Details
          </button>
        </div>

        <div>
          <button
            className="page-selector__button"
            onClick={() => {
              window.open("/form", "_blank");
            }}
          >
            Add New
          </button>
        </div>
      </div>

      <div className="page-selector__wrapper">
      <div>
        <button
          className="page-selector__button"
          onClick={() => {
            window.open("/waitlist", "_blank");
          }}
        >
          Patient Waitlist
        </button>
      </div>

      <div>
        <button
          className="page-selector__button"
          onClick={() => {
            window.open("http://localhost:3002", "_blank");
          }}
        >
          Patient detection{" "}
        </button>
      </div>
      </div>
    </div>
  );
}

export default PageSelector;
