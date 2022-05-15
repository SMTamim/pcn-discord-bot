module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity("Tamim's PC! 😐", { type: 'PLAYING' });
        client.user.setStatus('active');
        // console.log(client.commands);
        console.log("PCN is up and ready!");
    },
};
