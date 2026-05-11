import Link from "next/link";

const RelatedTags = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="d-flex gap-2 flex-column my-5">
      <h3>Related Tags</h3>
      <div className="d-flex align-items-center gap-2 flex-wrap">
        {tags?.map((tag, index) => (
          <Link
            className="border py-2 px-3"
            href={`/?search=%23${tag}`}
            target="_blank"
            key={index}
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedTags;
