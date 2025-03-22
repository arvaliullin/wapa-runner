import { connect, StringCodec } from "nats";

const nc = await connect();
const sc = StringCodec();
const sub = nc.subscribe("hello");
for await (const m of sub) {
    console.log(sc.decode(m.data));
}

sub.closed
    .then(() => {
        console.log("subscription closed");
    })
    .catch((err) => {
        console.err(`subscription closed with an error ${err.message}`);
    });