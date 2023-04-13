import "./HomeMenu.scss";

function HomeMenu() {
  return (
    <div className="home-menu">
      <div>
        {" "}
        <h1>FRMS<br/>(Fast Registry Management System)</h1>{" "}
      </div>
      <div className="home-menu__wrapper">
        <div>
          <button
            className="home-menu__button"
            onClick={() => {
              window.open("/practicianmenu", "_blank");
            }}
          >
            Practician Menu
          </button>
        </div>

        <div>
          <button
            className="home-menu__button"
            onClick={() => {
              window.open("/form", "_blank");
            }}
          >
            Add New
          </button>
        </div>
      </div>

      <div className="home-menu__wrapper">
      <div>
        <button
          className="home-menu__button"
          onClick={() => {
            window.open("/waitlist", "_blank");
          }}
        >
          Patient Waitlist
        </button>
      </div>

      <div>
        <button
          className="home-menu__button"
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

export default HomeMenu;
