import Button from "../components/Button";

function Tasks() {
  const model = [
    {
      name: "Colonne 1",
      cards: [
        {
          label: "Ma première card",
        },
      ],
    },
    {
      name: "Colonne 2",
      cards: [
        {
          label: "Ma deuxième card",
        },
      ],
    },
  ];

  return (
    <div className="c-tasks">
      <div className="c-tasks__intro">
        <h2 className="c-h-l u-mb-8">Mes taches</h2>
        <Button color="secondary" label="Ajouter une colonne " />
      </div>

      <div className="c-table">
        {model.map((el) => (
          <div className="c-table__col">
            <p className="c-text-l u-mb-12">{el.name}</p>
            <div>
              {el.cards.map((card) => (
                <div className="c-table__card">{card.label}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
