import React from "react";
import Link from "next/link";

const cards = [
  {
    id: 3,
    title: "Razorpay automation ideas",
    author: "Vaishali Raghuvanshi",
    date: "July 19, 2026",
    image:
      "https://stuff.thingsofbrand.com/razorpay.com/images/img678aa307e6_razorpay.jpg",
    link: "/razorpay-automation-ideas",
    icons: ["bi-send"],
  },
];

const RecentlyPublished = () => {
  return (
    <div className="py-5">
      <h2 className="fst-italic mb-4">Recently published</h2>

      <div className="row g-4">
        {cards.map((card) => (
          <div key={card.id} className="col-lg-4 col-md-6">
            <Link
              href={card.link}
              className="text-decoration-none text-dark d-block"
            >
              <div className="card h-100" style={{ cursor: "pointer" }}>
                <div className="card-body d-flex align-items-start gap-3">
                  <div className="d-flex gap-2">
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={card.title}
                        className="border rounded-3 p-2"
                        style={{ width: "48px", height: "48px", objectFit: "contain" }}
                      />
                    ) : (
                      card.icons.map((icon) => (
                        <div key={icon} className="border rounded-3 p-2">
                          <i className={`bi ${icon} fs-4`}></i>
                        </div>
                      ))
                    )}
                  </div>

                  <div>
                    <h5 className="fw-bold mb-2">{card.title}</h5>

                    <small className="text-secondary">
                      {card.author} · {card.date}
                    </small>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPublished;
