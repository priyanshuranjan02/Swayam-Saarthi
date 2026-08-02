import PageLayout from "@/components/layout/PageLayout";

const About = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6 text-primary">
          About Swayam Saarthi
        </h1>

        <p className="text-lg text-muted-foreground mb-4">
          Swayam Saarthi is a reverse ride-hailing platform that allows users
          to hire verified drivers for their own vehicles.
        </p>

        <p className="text-lg text-muted-foreground mb-4">
          The platform connects vehicle owners with professional drivers,
          providing a safe, convenient, and reliable driving experience.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Features
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>User, Driver and Admin dashboards</li>
          <li>Secure JWT Authentication</li>
          <li>Real-time booking updates using Socket.IO</li>
          <li>Driver selection and booking management</li>
          <li>Payment tracking</li>
          <li>Booking history and earnings</li>
        </ul>
      </div>
    </PageLayout>
  );
};

export default About;