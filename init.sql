CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    cpu NUMERIC,
    gpu NUMERIC,
    disk NUMERIC,
    ram NUMERIC,
    temperature NUMERIC
);

DO $$
BEGIN
    FOR i IN 1..1000000 LOOP
        INSERT INTO logs (cpu, gpu, disk, ram, temperature)
        VALUES (
            random() * 100,
            random() * 100,
            random() * 100,
            random() * 100,
            random() * 100
        );
    END LOOP;
END $$;