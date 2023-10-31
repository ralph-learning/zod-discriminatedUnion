import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import styles from "./Form.module.css";

const baseScheme = z.object({
  quantity: z.number(),
  frequency: z.string().optional(),
});

const formWith = z
  .object({
    isShow: z.literal(true),
    email: z.string().min(1).email(),
  })
  .extend(baseScheme.shape);

const formWithout = z
  .object({
    isShow: z.literal(false),
  })
  .extend(baseScheme.shape);

const formSchemeRecurrence = z.discriminatedUnion("isShow", [
  formWith,
  formWithout,
]);

{
  /*
const contact = z.object({
  isContact: z.literal(true),
  phone: z.string(),
});

const noContact = z
  .object({
    isContact: z.literal(false),
  })
  .extend(formSchemeRecurrence); // Nao consigo extender um discriminatedUnion

// TS error
const moreOne = z.discriminatedUnion("isContact", [contact, noContact]);

*/
}

type FormScheme = z.infer<typeof formSchemeRecurrence>;

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormScheme>({
    resolver: zodResolver(formSchemeRecurrence),
    shouldUnregister: true,
    defaultValues: {
      isShow: false,
    },
  });

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit((data) => console.log("result: ", data))}
    >
      <label>
        <input type="checkbox" {...register("isShow")} />
        Mostrar e-mail
      </label>

      {watch("isShow") && (
        <input
          {...register("email")}
          className={styles.input}
          placeholder="E-mail"
        />
      )}

      {Object.keys(errors).map((error) => (
        <li key={error}>
          {error}: {errors[error].message}
        </li>
      ))}

      <button className={styles.btn}>Send</button>
    </form>
  );
}

export default App;
