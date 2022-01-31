import { useState } from "react";
import TextInput from "./TextInput";

const ContactForm = () => {
  const [contactReason, setContactReason] = useState<string>("");
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  return (
    <div className="flex flex-col items-center mb-20">
      <p className="text-4xl font-bold">Form</p>
      <form action="" className="flex flex-col items-center pt-10 gap-7">
        <TextInput
          value={contactReason}
          onChange={setContactReason}
          placeholder="Why Contacting?"
        />
        <TextInput value={fname} onChange={setFname} placeholder="First Name" />
        <TextInput value={lname} onChange={setLname} placeholder="Last Name" />
        <TextInput value={email} onChange={setEmail} placeholder="Email" />
        <TextInput
          value={phone}
          onChange={setPhone}
          placeholder="Phone Number"
        />
        <TextInput
          value={message}
          onChange={setMessage}
          placeholder="Message"
        />
      </form>
    </div>
  );
};

export default ContactForm;
