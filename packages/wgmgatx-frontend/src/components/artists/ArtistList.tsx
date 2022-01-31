import ProfileCard from "@components/cards/ProfileCard";

const ArtistList = () => {
  return (
    <div className="flex flex-wrap justify-center pt-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((arr, i) => (
          <ProfileCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default ArtistList;
