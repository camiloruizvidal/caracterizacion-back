CREATE OR REPLACE FUNCTION public.actualizar_version() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO version (date_last_version)
        VALUES (NOW());
    END IF;

    RETURN NEW;
END;
$$;


CREATE TRIGGER tr_actualizar_version
AFTER INSERT OR UPDATE ON ficha_descripcion
FOR EACH ROW
EXECUTE FUNCTION public.actualizar_version();
CREATE OR REPLACE FUNCTION public.handle_ddl_event()
    RETURNS event_trigger
    LANGUAGE plpgsql
AS $$
DECLARE
    event_info text;
BEGIN
    -- Obtener información sobre el evento DDL
    SELECT current_setting('pg_ddl_command_tags') INTO event_info;

    -- Verificar si el evento DDL está relacionado con las tablas deseadas
    IF position('ALTER TABLE' IN event_info) > 0 AND
       (position('persona' IN event_info) > 0 OR
        position('ficha' IN event_info) > 0 OR
        position('tarjeta_familiar' IN event_info) > 0 OR
        position('psicosocial_persona' IN event_info) > 0) THEN
        -- Insertar la fecha actual en la tabla version
        INSERT INTO version (date_last_version)
        VALUES (NOW());
    END IF;
END;
$$;

-- Habilitar el disparador de eventos DDL
CREATE EVENT TRIGGER et_ddl_event
    ON ddl_command_end
    EXECUTE FUNCTION public.handle_ddl_event();