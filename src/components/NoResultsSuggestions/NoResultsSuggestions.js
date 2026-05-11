const DEFAULT_SUGGESTIONS = [
  {
    title: "Top 7 CRM tools for solo consultants in 2025",
    tags: ["CRM", "Solo"],
  },
  {
    title: "How to pick a CRM when you work alone (without spreadsheets)",
    tags: ["CRM", "Productivity"],
  },
  {
    title: "CRM vs spreadsheets: which wins for independent consultants",
    tags: ["CRM", "Comparison"],
  },
  {
    title: "Best free CRM for freelancers who hate admin work",
    tags: ["CRM", "Free Tools"],
  },
];

const NoResultsSuggestions = ({ suggestions = DEFAULT_SUGGESTIONS, onSelect }) => {
  return (
    <div
      className="d-flex flex-column gap-3 px-5 w-100"
      style={{ gridColumn: "1 / -1" }}
    >
      {suggestions.map((item, idx) => (
        <button
          key={idx}
          type="button"
          className="d-block w-100 text-start bg-white border rounded p-3"
          onClick={() => onSelect && onSelect(item)}
        >
          <h3 className="h6 fw-semibold mb-2">{item.title}</h3>
          <div className="d-flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="badge bg-light text-dark border fw-normal"
              >
                {tag}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
};

export default NoResultsSuggestions;
