--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE admin;
ALTER ROLE admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'md5f6fdffe48c908deb0f4c3bd36c032e72';






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 13.12
-- Dumped by pg_dump version 13.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "keycloak" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 13.12
-- Dumped by pg_dump version 13.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: keycloak; Type: DATABASE; Schema: -; Owner: admin
--

CREATE DATABASE keycloak WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE keycloak OWNER TO admin;

\connect keycloak

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_event_entity; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.admin_event_entity (
                                         id character varying(36) NOT NULL,
                                         admin_event_time bigint,
                                         realm_id character varying(255),
                                         operation_type character varying(255),
                                         auth_realm_id character varying(255),
                                         auth_client_id character varying(255),
                                         auth_user_id character varying(255),
                                         ip_address character varying(255),
                                         resource_path character varying(2550),
                                         representation text,
                                         error character varying(255),
                                         resource_type character varying(64)
);


ALTER TABLE public.admin_event_entity OWNER TO admin;

--
-- Name: associated_policy; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.associated_policy (
                                        policy_id character varying(36) NOT NULL,
                                        associated_policy_id character varying(36) NOT NULL
);


ALTER TABLE public.associated_policy OWNER TO admin;

--
-- Name: authentication_execution; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authentication_execution (
                                               id character varying(36) NOT NULL,
                                               alias character varying(255),
                                               authenticator character varying(36),
                                               realm_id character varying(36),
                                               flow_id character varying(36),
                                               requirement integer,
                                               priority integer,
                                               authenticator_flow boolean DEFAULT false NOT NULL,
                                               auth_flow_id character varying(36),
                                               auth_config character varying(36)
);


ALTER TABLE public.authentication_execution OWNER TO admin;

--
-- Name: authentication_flow; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authentication_flow (
                                          id character varying(36) NOT NULL,
                                          alias character varying(255),
                                          description character varying(255),
                                          realm_id character varying(36),
                                          provider_id character varying(36) DEFAULT 'basic-flow'::character varying NOT NULL,
                                          top_level boolean DEFAULT false NOT NULL,
                                          built_in boolean DEFAULT false NOT NULL
);


ALTER TABLE public.authentication_flow OWNER TO admin;

--
-- Name: authenticator_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authenticator_config (
                                           id character varying(36) NOT NULL,
                                           alias character varying(255),
                                           realm_id character varying(36)
);


ALTER TABLE public.authenticator_config OWNER TO admin;

--
-- Name: authenticator_config_entry; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.authenticator_config_entry (
                                                 authenticator_id character varying(36) NOT NULL,
                                                 value text,
                                                 name character varying(255) NOT NULL
);


ALTER TABLE public.authenticator_config_entry OWNER TO admin;

--
-- Name: broker_link; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.broker_link (
                                  identity_provider character varying(255) NOT NULL,
                                  storage_provider_id character varying(255),
                                  realm_id character varying(36) NOT NULL,
                                  broker_user_id character varying(255),
                                  broker_username character varying(255),
                                  token text,
                                  user_id character varying(255) NOT NULL
);


ALTER TABLE public.broker_link OWNER TO admin;

--
-- Name: client; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client (
                             id character varying(36) NOT NULL,
                             enabled boolean DEFAULT false NOT NULL,
                             full_scope_allowed boolean DEFAULT false NOT NULL,
                             client_id character varying(255),
                             not_before integer,
                             public_client boolean DEFAULT false NOT NULL,
                             secret character varying(255),
                             base_url character varying(255),
                             bearer_only boolean DEFAULT false NOT NULL,
                             management_url character varying(255),
                             surrogate_auth_required boolean DEFAULT false NOT NULL,
                             realm_id character varying(36),
                             protocol character varying(255),
                             node_rereg_timeout integer DEFAULT 0,
                             frontchannel_logout boolean DEFAULT false NOT NULL,
                             consent_required boolean DEFAULT false NOT NULL,
                             name character varying(255),
                             service_accounts_enabled boolean DEFAULT false NOT NULL,
                             client_authenticator_type character varying(255),
                             root_url character varying(255),
                             description character varying(255),
                             registration_token character varying(255),
                             standard_flow_enabled boolean DEFAULT true NOT NULL,
                             implicit_flow_enabled boolean DEFAULT false NOT NULL,
                             direct_access_grants_enabled boolean DEFAULT false NOT NULL,
                             always_display_in_console boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client OWNER TO admin;

--
-- Name: client_attributes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_attributes (
                                        client_id character varying(36) NOT NULL,
                                        name character varying(255) NOT NULL,
                                        value text
);


ALTER TABLE public.client_attributes OWNER TO admin;

--
-- Name: client_auth_flow_bindings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_auth_flow_bindings (
                                                client_id character varying(36) NOT NULL,
                                                flow_id character varying(36),
                                                binding_name character varying(255) NOT NULL
);


ALTER TABLE public.client_auth_flow_bindings OWNER TO admin;

--
-- Name: client_initial_access; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_initial_access (
                                            id character varying(36) NOT NULL,
                                            realm_id character varying(36) NOT NULL,
                                            "timestamp" integer,
                                            expiration integer,
                                            count integer,
                                            remaining_count integer
);


ALTER TABLE public.client_initial_access OWNER TO admin;

--
-- Name: client_node_registrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_node_registrations (
                                                client_id character varying(36) NOT NULL,
                                                value integer,
                                                name character varying(255) NOT NULL
);


ALTER TABLE public.client_node_registrations OWNER TO admin;

--
-- Name: client_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_scope (
                                   id character varying(36) NOT NULL,
                                   name character varying(255),
                                   realm_id character varying(36),
                                   description character varying(255),
                                   protocol character varying(255)
);


ALTER TABLE public.client_scope OWNER TO admin;

--
-- Name: client_scope_attributes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_scope_attributes (
                                              scope_id character varying(36) NOT NULL,
                                              value character varying(2048),
                                              name character varying(255) NOT NULL
);


ALTER TABLE public.client_scope_attributes OWNER TO admin;

--
-- Name: client_scope_client; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_scope_client (
                                          client_id character varying(255) NOT NULL,
                                          scope_id character varying(255) NOT NULL,
                                          default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.client_scope_client OWNER TO admin;

--
-- Name: client_scope_role_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_scope_role_mapping (
                                                scope_id character varying(36) NOT NULL,
                                                role_id character varying(36) NOT NULL
);


ALTER TABLE public.client_scope_role_mapping OWNER TO admin;

--
-- Name: client_session; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session (
                                     id character varying(36) NOT NULL,
                                     client_id character varying(36),
                                     redirect_uri character varying(255),
                                     state character varying(255),
                                     "timestamp" integer,
                                     session_id character varying(36),
                                     auth_method character varying(255),
                                     realm_id character varying(255),
                                     auth_user_id character varying(36),
                                     current_action character varying(36)
);


ALTER TABLE public.client_session OWNER TO admin;

--
-- Name: client_session_auth_status; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session_auth_status (
                                                 authenticator character varying(36) NOT NULL,
                                                 status integer,
                                                 client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_auth_status OWNER TO admin;

--
-- Name: client_session_note; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session_note (
                                          name character varying(255) NOT NULL,
                                          value character varying(255),
                                          client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_note OWNER TO admin;

--
-- Name: client_session_prot_mapper; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session_prot_mapper (
                                                 protocol_mapper_id character varying(36) NOT NULL,
                                                 client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_prot_mapper OWNER TO admin;

--
-- Name: client_session_role; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_session_role (
                                          role_id character varying(255) NOT NULL,
                                          client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_session_role OWNER TO admin;

--
-- Name: client_user_session_note; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.client_user_session_note (
                                               name character varying(255) NOT NULL,
                                               value character varying(2048),
                                               client_session character varying(36) NOT NULL
);


ALTER TABLE public.client_user_session_note OWNER TO admin;

--
-- Name: component; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.component (
                                id character varying(36) NOT NULL,
                                name character varying(255),
                                parent_id character varying(36),
                                provider_id character varying(36),
                                provider_type character varying(255),
                                realm_id character varying(36),
                                sub_type character varying(255)
);


ALTER TABLE public.component OWNER TO admin;

--
-- Name: component_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.component_config (
                                       id character varying(36) NOT NULL,
                                       component_id character varying(36) NOT NULL,
                                       name character varying(255) NOT NULL,
                                       value character varying(4000)
);


ALTER TABLE public.component_config OWNER TO admin;

--
-- Name: composite_role; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.composite_role (
                                     composite character varying(36) NOT NULL,
                                     child_role character varying(36) NOT NULL
);


ALTER TABLE public.composite_role OWNER TO admin;

--
-- Name: credential; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.credential (
                                 id character varying(36) NOT NULL,
                                 salt bytea,
                                 type character varying(255),
                                 user_id character varying(36),
                                 created_date bigint,
                                 user_label character varying(255),
                                 secret_data text,
                                 credential_data text,
                                 priority integer
);


ALTER TABLE public.credential OWNER TO admin;

--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.databasechangelog (
                                        id character varying(255) NOT NULL,
                                        author character varying(255) NOT NULL,
                                        filename character varying(255) NOT NULL,
                                        dateexecuted timestamp without time zone NOT NULL,
                                        orderexecuted integer NOT NULL,
                                        exectype character varying(10) NOT NULL,
                                        md5sum character varying(35),
                                        description character varying(255),
                                        comments character varying(255),
                                        tag character varying(255),
                                        liquibase character varying(20),
                                        contexts character varying(255),
                                        labels character varying(255),
                                        deployment_id character varying(10)
);


ALTER TABLE public.databasechangelog OWNER TO admin;

--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.databasechangeloglock (
                                            id integer NOT NULL,
                                            locked boolean NOT NULL,
                                            lockgranted timestamp without time zone,
                                            lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO admin;

--
-- Name: default_client_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.default_client_scope (
                                           realm_id character varying(36) NOT NULL,
                                           scope_id character varying(36) NOT NULL,
                                           default_scope boolean DEFAULT false NOT NULL
);


ALTER TABLE public.default_client_scope OWNER TO admin;

--
-- Name: event_entity; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.event_entity (
                                   id character varying(36) NOT NULL,
                                   client_id character varying(255),
                                   details_json character varying(2550),
                                   error character varying(255),
                                   ip_address character varying(255),
                                   realm_id character varying(255),
                                   session_id character varying(255),
                                   event_time bigint,
                                   type character varying(255),
                                   user_id character varying(255)
);


ALTER TABLE public.event_entity OWNER TO admin;

--
-- Name: fed_user_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_attribute (
                                         id character varying(36) NOT NULL,
                                         name character varying(255) NOT NULL,
                                         user_id character varying(255) NOT NULL,
                                         realm_id character varying(36) NOT NULL,
                                         storage_provider_id character varying(36),
                                         value character varying(2024)
);


ALTER TABLE public.fed_user_attribute OWNER TO admin;

--
-- Name: fed_user_consent; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_consent (
                                       id character varying(36) NOT NULL,
                                       client_id character varying(255),
                                       user_id character varying(255) NOT NULL,
                                       realm_id character varying(36) NOT NULL,
                                       storage_provider_id character varying(36),
                                       created_date bigint,
                                       last_updated_date bigint,
                                       client_storage_provider character varying(36),
                                       external_client_id character varying(255)
);


ALTER TABLE public.fed_user_consent OWNER TO admin;

--
-- Name: fed_user_consent_cl_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_consent_cl_scope (
                                                user_consent_id character varying(36) NOT NULL,
                                                scope_id character varying(36) NOT NULL
);


ALTER TABLE public.fed_user_consent_cl_scope OWNER TO admin;

--
-- Name: fed_user_credential; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_credential (
                                          id character varying(36) NOT NULL,
                                          salt bytea,
                                          type character varying(255),
                                          created_date bigint,
                                          user_id character varying(255) NOT NULL,
                                          realm_id character varying(36) NOT NULL,
                                          storage_provider_id character varying(36),
                                          user_label character varying(255),
                                          secret_data text,
                                          credential_data text,
                                          priority integer
);


ALTER TABLE public.fed_user_credential OWNER TO admin;

--
-- Name: fed_user_group_membership; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_group_membership (
                                                group_id character varying(36) NOT NULL,
                                                user_id character varying(255) NOT NULL,
                                                realm_id character varying(36) NOT NULL,
                                                storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_group_membership OWNER TO admin;

--
-- Name: fed_user_required_action; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_required_action (
                                               required_action character varying(255) DEFAULT ' '::character varying NOT NULL,
                                               user_id character varying(255) NOT NULL,
                                               realm_id character varying(36) NOT NULL,
                                               storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_required_action OWNER TO admin;

--
-- Name: fed_user_role_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fed_user_role_mapping (
                                            role_id character varying(36) NOT NULL,
                                            user_id character varying(255) NOT NULL,
                                            realm_id character varying(36) NOT NULL,
                                            storage_provider_id character varying(36)
);


ALTER TABLE public.fed_user_role_mapping OWNER TO admin;

--
-- Name: federated_identity; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.federated_identity (
                                         identity_provider character varying(255) NOT NULL,
                                         realm_id character varying(36),
                                         federated_user_id character varying(255),
                                         federated_username character varying(255),
                                         token text,
                                         user_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_identity OWNER TO admin;

--
-- Name: federated_user; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.federated_user (
                                     id character varying(255) NOT NULL,
                                     storage_provider_id character varying(255),
                                     realm_id character varying(36) NOT NULL
);


ALTER TABLE public.federated_user OWNER TO admin;

--
-- Name: group_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.group_attribute (
                                      id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
                                      name character varying(255) NOT NULL,
                                      value character varying(255),
                                      group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_attribute OWNER TO admin;

--
-- Name: group_role_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.group_role_mapping (
                                         role_id character varying(36) NOT NULL,
                                         group_id character varying(36) NOT NULL
);


ALTER TABLE public.group_role_mapping OWNER TO admin;

--
-- Name: identity_provider; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.identity_provider (
                                        internal_id character varying(36) NOT NULL,
                                        enabled boolean DEFAULT false NOT NULL,
                                        provider_alias character varying(255),
                                        provider_id character varying(255),
                                        store_token boolean DEFAULT false NOT NULL,
                                        authenticate_by_default boolean DEFAULT false NOT NULL,
                                        realm_id character varying(36),
                                        add_token_role boolean DEFAULT true NOT NULL,
                                        trust_email boolean DEFAULT false NOT NULL,
                                        first_broker_login_flow_id character varying(36),
                                        post_broker_login_flow_id character varying(36),
                                        provider_display_name character varying(255),
                                        link_only boolean DEFAULT false NOT NULL
);


ALTER TABLE public.identity_provider OWNER TO admin;

--
-- Name: identity_provider_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.identity_provider_config (
                                               identity_provider_id character varying(36) NOT NULL,
                                               value text,
                                               name character varying(255) NOT NULL
);


ALTER TABLE public.identity_provider_config OWNER TO admin;

--
-- Name: identity_provider_mapper; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.identity_provider_mapper (
                                               id character varying(36) NOT NULL,
                                               name character varying(255) NOT NULL,
                                               idp_alias character varying(255) NOT NULL,
                                               idp_mapper_name character varying(255) NOT NULL,
                                               realm_id character varying(36) NOT NULL
);


ALTER TABLE public.identity_provider_mapper OWNER TO admin;

--
-- Name: idp_mapper_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.idp_mapper_config (
                                        idp_mapper_id character varying(36) NOT NULL,
                                        value text,
                                        name character varying(255) NOT NULL
);


ALTER TABLE public.idp_mapper_config OWNER TO admin;

--
-- Name: keycloak_group; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.keycloak_group (
                                     id character varying(36) NOT NULL,
                                     name character varying(255),
                                     parent_group character varying(36) NOT NULL,
                                     realm_id character varying(36)
);


ALTER TABLE public.keycloak_group OWNER TO admin;

--
-- Name: keycloak_role; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.keycloak_role (
                                    id character varying(36) NOT NULL,
                                    client_realm_constraint character varying(255),
                                    client_role boolean DEFAULT false NOT NULL,
                                    description character varying(255),
                                    name character varying(255),
                                    realm_id character varying(255),
                                    client character varying(36),
                                    realm character varying(36)
);


ALTER TABLE public.keycloak_role OWNER TO admin;

--
-- Name: migration_model; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.migration_model (
                                      id character varying(36) NOT NULL,
                                      version character varying(36),
                                      update_time bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.migration_model OWNER TO admin;

--
-- Name: offline_client_session; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.offline_client_session (
                                             user_session_id character varying(36) NOT NULL,
                                             client_id character varying(255) NOT NULL,
                                             offline_flag character varying(4) NOT NULL,
                                             "timestamp" integer,
                                             data text,
                                             client_storage_provider character varying(36) DEFAULT 'local'::character varying NOT NULL,
                                             external_client_id character varying(255) DEFAULT 'local'::character varying NOT NULL
);


ALTER TABLE public.offline_client_session OWNER TO admin;

--
-- Name: offline_user_session; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.offline_user_session (
                                           user_session_id character varying(36) NOT NULL,
                                           user_id character varying(255) NOT NULL,
                                           realm_id character varying(36) NOT NULL,
                                           created_on integer NOT NULL,
                                           offline_flag character varying(4) NOT NULL,
                                           data text,
                                           last_session_refresh integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.offline_user_session OWNER TO admin;

--
-- Name: policy_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.policy_config (
                                    policy_id character varying(36) NOT NULL,
                                    name character varying(255) NOT NULL,
                                    value text
);


ALTER TABLE public.policy_config OWNER TO admin;

--
-- Name: protocol_mapper; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.protocol_mapper (
                                      id character varying(36) NOT NULL,
                                      name character varying(255) NOT NULL,
                                      protocol character varying(255) NOT NULL,
                                      protocol_mapper_name character varying(255) NOT NULL,
                                      client_id character varying(36),
                                      client_scope_id character varying(36)
);


ALTER TABLE public.protocol_mapper OWNER TO admin;

--
-- Name: protocol_mapper_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.protocol_mapper_config (
                                             protocol_mapper_id character varying(36) NOT NULL,
                                             value text,
                                             name character varying(255) NOT NULL
);


ALTER TABLE public.protocol_mapper_config OWNER TO admin;

--
-- Name: realm; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm (
                            id character varying(36) NOT NULL,
                            access_code_lifespan integer,
                            user_action_lifespan integer,
                            access_token_lifespan integer,
                            account_theme character varying(255),
                            admin_theme character varying(255),
                            email_theme character varying(255),
                            enabled boolean DEFAULT false NOT NULL,
                            events_enabled boolean DEFAULT false NOT NULL,
                            events_expiration bigint,
                            login_theme character varying(255),
                            name character varying(255),
                            not_before integer,
                            password_policy character varying(2550),
                            registration_allowed boolean DEFAULT false NOT NULL,
                            remember_me boolean DEFAULT false NOT NULL,
                            reset_password_allowed boolean DEFAULT false NOT NULL,
                            social boolean DEFAULT false NOT NULL,
                            ssl_required character varying(255),
                            sso_idle_timeout integer,
                            sso_max_lifespan integer,
                            update_profile_on_soc_login boolean DEFAULT false NOT NULL,
                            verify_email boolean DEFAULT false NOT NULL,
                            master_admin_client character varying(36),
                            login_lifespan integer,
                            internationalization_enabled boolean DEFAULT false NOT NULL,
                            default_locale character varying(255),
                            reg_email_as_username boolean DEFAULT false NOT NULL,
                            admin_events_enabled boolean DEFAULT false NOT NULL,
                            admin_events_details_enabled boolean DEFAULT false NOT NULL,
                            edit_username_allowed boolean DEFAULT false NOT NULL,
                            otp_policy_counter integer DEFAULT 0,
                            otp_policy_window integer DEFAULT 1,
                            otp_policy_period integer DEFAULT 30,
                            otp_policy_digits integer DEFAULT 6,
                            otp_policy_alg character varying(36) DEFAULT 'HmacSHA1'::character varying,
                            otp_policy_type character varying(36) DEFAULT 'totp'::character varying,
                            browser_flow character varying(36),
                            registration_flow character varying(36),
                            direct_grant_flow character varying(36),
                            reset_credentials_flow character varying(36),
                            client_auth_flow character varying(36),
                            offline_session_idle_timeout integer DEFAULT 0,
                            revoke_refresh_token boolean DEFAULT false NOT NULL,
                            access_token_life_implicit integer DEFAULT 0,
                            login_with_email_allowed boolean DEFAULT true NOT NULL,
                            duplicate_emails_allowed boolean DEFAULT false NOT NULL,
                            docker_auth_flow character varying(36),
                            refresh_token_max_reuse integer DEFAULT 0,
                            allow_user_managed_access boolean DEFAULT false NOT NULL,
                            sso_max_lifespan_remember_me integer DEFAULT 0 NOT NULL,
                            sso_idle_timeout_remember_me integer DEFAULT 0 NOT NULL,
                            default_role character varying(255)
);


ALTER TABLE public.realm OWNER TO admin;

--
-- Name: realm_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_attribute (
                                      name character varying(255) NOT NULL,
                                      realm_id character varying(36) NOT NULL,
                                      value text
);


ALTER TABLE public.realm_attribute OWNER TO admin;

--
-- Name: realm_default_groups; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_default_groups (
                                           realm_id character varying(36) NOT NULL,
                                           group_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_default_groups OWNER TO admin;

--
-- Name: realm_enabled_event_types; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_enabled_event_types (
                                                realm_id character varying(36) NOT NULL,
                                                value character varying(255) NOT NULL
);


ALTER TABLE public.realm_enabled_event_types OWNER TO admin;

--
-- Name: realm_events_listeners; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_events_listeners (
                                             realm_id character varying(36) NOT NULL,
                                             value character varying(255) NOT NULL
);


ALTER TABLE public.realm_events_listeners OWNER TO admin;

--
-- Name: realm_localizations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_localizations (
                                          realm_id character varying(255) NOT NULL,
                                          locale character varying(255) NOT NULL,
                                          texts text NOT NULL
);


ALTER TABLE public.realm_localizations OWNER TO admin;

--
-- Name: realm_required_credential; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_required_credential (
                                                type character varying(255) NOT NULL,
                                                form_label character varying(255),
                                                input boolean DEFAULT false NOT NULL,
                                                secret boolean DEFAULT false NOT NULL,
                                                realm_id character varying(36) NOT NULL
);


ALTER TABLE public.realm_required_credential OWNER TO admin;

--
-- Name: realm_smtp_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_smtp_config (
                                        realm_id character varying(36) NOT NULL,
                                        value character varying(255),
                                        name character varying(255) NOT NULL
);


ALTER TABLE public.realm_smtp_config OWNER TO admin;

--
-- Name: realm_supported_locales; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.realm_supported_locales (
                                              realm_id character varying(36) NOT NULL,
                                              value character varying(255) NOT NULL
);


ALTER TABLE public.realm_supported_locales OWNER TO admin;

--
-- Name: redirect_uris; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.redirect_uris (
                                    client_id character varying(36) NOT NULL,
                                    value character varying(255) NOT NULL
);


ALTER TABLE public.redirect_uris OWNER TO admin;

--
-- Name: required_action_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.required_action_config (
                                             required_action_id character varying(36) NOT NULL,
                                             value text,
                                             name character varying(255) NOT NULL
);


ALTER TABLE public.required_action_config OWNER TO admin;

--
-- Name: required_action_provider; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.required_action_provider (
                                               id character varying(36) NOT NULL,
                                               alias character varying(255),
                                               name character varying(255),
                                               realm_id character varying(36),
                                               enabled boolean DEFAULT false NOT NULL,
                                               default_action boolean DEFAULT false NOT NULL,
                                               provider_id character varying(255),
                                               priority integer
);


ALTER TABLE public.required_action_provider OWNER TO admin;

--
-- Name: resource_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_attribute (
                                         id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL,
                                         name character varying(255) NOT NULL,
                                         value character varying(255),
                                         resource_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_attribute OWNER TO admin;

--
-- Name: resource_policy; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_policy (
                                      resource_id character varying(36) NOT NULL,
                                      policy_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_policy OWNER TO admin;

--
-- Name: resource_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_scope (
                                     resource_id character varying(36) NOT NULL,
                                     scope_id character varying(36) NOT NULL
);


ALTER TABLE public.resource_scope OWNER TO admin;

--
-- Name: resource_server; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server (
                                      id character varying(36) NOT NULL,
                                      allow_rs_remote_mgmt boolean DEFAULT false NOT NULL,
                                      policy_enforce_mode character varying(15) NOT NULL,
                                      decision_strategy smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.resource_server OWNER TO admin;

--
-- Name: resource_server_perm_ticket; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server_perm_ticket (
                                                  id character varying(36) NOT NULL,
                                                  owner character varying(255) NOT NULL,
                                                  requester character varying(255) NOT NULL,
                                                  created_timestamp bigint NOT NULL,
                                                  granted_timestamp bigint,
                                                  resource_id character varying(36) NOT NULL,
                                                  scope_id character varying(36),
                                                  resource_server_id character varying(36) NOT NULL,
                                                  policy_id character varying(36)
);


ALTER TABLE public.resource_server_perm_ticket OWNER TO admin;

--
-- Name: resource_server_policy; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server_policy (
                                             id character varying(36) NOT NULL,
                                             name character varying(255) NOT NULL,
                                             description character varying(255),
                                             type character varying(255) NOT NULL,
                                             decision_strategy character varying(20),
                                             logic character varying(20),
                                             resource_server_id character varying(36) NOT NULL,
                                             owner character varying(255)
);


ALTER TABLE public.resource_server_policy OWNER TO admin;

--
-- Name: resource_server_resource; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server_resource (
                                               id character varying(36) NOT NULL,
                                               name character varying(255) NOT NULL,
                                               type character varying(255),
                                               icon_uri character varying(255),
                                               owner character varying(255) NOT NULL,
                                               resource_server_id character varying(36) NOT NULL,
                                               owner_managed_access boolean DEFAULT false NOT NULL,
                                               display_name character varying(255)
);


ALTER TABLE public.resource_server_resource OWNER TO admin;

--
-- Name: resource_server_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_server_scope (
                                            id character varying(36) NOT NULL,
                                            name character varying(255) NOT NULL,
                                            icon_uri character varying(255),
                                            resource_server_id character varying(36) NOT NULL,
                                            display_name character varying(255)
);


ALTER TABLE public.resource_server_scope OWNER TO admin;

--
-- Name: resource_uris; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_uris (
                                    resource_id character varying(36) NOT NULL,
                                    value character varying(255) NOT NULL
);


ALTER TABLE public.resource_uris OWNER TO admin;

--
-- Name: role_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.role_attribute (
                                     id character varying(36) NOT NULL,
                                     role_id character varying(36) NOT NULL,
                                     name character varying(255) NOT NULL,
                                     value character varying(255)
);


ALTER TABLE public.role_attribute OWNER TO admin;

--
-- Name: scope_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.scope_mapping (
                                    client_id character varying(36) NOT NULL,
                                    role_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_mapping OWNER TO admin;

--
-- Name: scope_policy; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.scope_policy (
                                   scope_id character varying(36) NOT NULL,
                                   policy_id character varying(36) NOT NULL
);


ALTER TABLE public.scope_policy OWNER TO admin;

--
-- Name: user_attribute; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_attribute (
                                     name character varying(255) NOT NULL,
                                     value character varying(255),
                                     user_id character varying(36) NOT NULL,
                                     id character varying(36) DEFAULT 'sybase-needs-something-here'::character varying NOT NULL
);


ALTER TABLE public.user_attribute OWNER TO admin;

--
-- Name: user_consent; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_consent (
                                   id character varying(36) NOT NULL,
                                   client_id character varying(255),
                                   user_id character varying(36) NOT NULL,
                                   created_date bigint,
                                   last_updated_date bigint,
                                   client_storage_provider character varying(36),
                                   external_client_id character varying(255)
);


ALTER TABLE public.user_consent OWNER TO admin;

--
-- Name: user_consent_client_scope; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_consent_client_scope (
                                                user_consent_id character varying(36) NOT NULL,
                                                scope_id character varying(36) NOT NULL
);


ALTER TABLE public.user_consent_client_scope OWNER TO admin;

--
-- Name: user_entity; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_entity (
                                  id character varying(36) NOT NULL,
                                  email character varying(255),
                                  email_constraint character varying(255),
                                  email_verified boolean DEFAULT false NOT NULL,
                                  enabled boolean DEFAULT false NOT NULL,
                                  federation_link character varying(255),
                                  first_name character varying(255),
                                  last_name character varying(255),
                                  realm_id character varying(255),
                                  username character varying(255),
                                  created_timestamp bigint,
                                  service_account_client_link character varying(255),
                                  not_before integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.user_entity OWNER TO admin;

--
-- Name: user_federation_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_federation_config (
                                             user_federation_provider_id character varying(36) NOT NULL,
                                             value character varying(255),
                                             name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_config OWNER TO admin;

--
-- Name: user_federation_mapper; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_federation_mapper (
                                             id character varying(36) NOT NULL,
                                             name character varying(255) NOT NULL,
                                             federation_provider_id character varying(36) NOT NULL,
                                             federation_mapper_type character varying(255) NOT NULL,
                                             realm_id character varying(36) NOT NULL
);


ALTER TABLE public.user_federation_mapper OWNER TO admin;

--
-- Name: user_federation_mapper_config; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_federation_mapper_config (
                                                    user_federation_mapper_id character varying(36) NOT NULL,
                                                    value character varying(255),
                                                    name character varying(255) NOT NULL
);


ALTER TABLE public.user_federation_mapper_config OWNER TO admin;

--
-- Name: user_federation_provider; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_federation_provider (
                                               id character varying(36) NOT NULL,
                                               changed_sync_period integer,
                                               display_name character varying(255),
                                               full_sync_period integer,
                                               last_sync integer,
                                               priority integer,
                                               provider_name character varying(255),
                                               realm_id character varying(36)
);


ALTER TABLE public.user_federation_provider OWNER TO admin;

--
-- Name: user_group_membership; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_group_membership (
                                            group_id character varying(36) NOT NULL,
                                            user_id character varying(36) NOT NULL
);


ALTER TABLE public.user_group_membership OWNER TO admin;

--
-- Name: user_required_action; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_required_action (
                                           user_id character varying(36) NOT NULL,
                                           required_action character varying(255) DEFAULT ' '::character varying NOT NULL
);


ALTER TABLE public.user_required_action OWNER TO admin;

--
-- Name: user_role_mapping; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_role_mapping (
                                        role_id character varying(255) NOT NULL,
                                        user_id character varying(36) NOT NULL
);


ALTER TABLE public.user_role_mapping OWNER TO admin;

--
-- Name: user_session; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_session (
                                   id character varying(36) NOT NULL,
                                   auth_method character varying(255),
                                   ip_address character varying(255),
                                   last_session_refresh integer,
                                   login_username character varying(255),
                                   realm_id character varying(255),
                                   remember_me boolean DEFAULT false NOT NULL,
                                   started integer,
                                   user_id character varying(255),
                                   user_session_state integer,
                                   broker_session_id character varying(255),
                                   broker_user_id character varying(255)
);


ALTER TABLE public.user_session OWNER TO admin;

--
-- Name: user_session_note; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_session_note (
                                        user_session character varying(36) NOT NULL,
                                        name character varying(255) NOT NULL,
                                        value character varying(2048)
);


ALTER TABLE public.user_session_note OWNER TO admin;

--
-- Name: username_login_failure; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.username_login_failure (
                                             realm_id character varying(36) NOT NULL,
                                             username character varying(255) NOT NULL,
                                             failed_login_not_before integer,
                                             last_failure bigint,
                                             last_ip_failure character varying(255),
                                             num_failures integer
);


ALTER TABLE public.username_login_failure OWNER TO admin;

--
-- Name: web_origins; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.web_origins (
                                  client_id character varying(36) NOT NULL,
                                  value character varying(255) NOT NULL
);


ALTER TABLE public.web_origins OWNER TO admin;

--
-- Data for Name: admin_event_entity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.admin_event_entity (id, admin_event_time, realm_id, operation_type, auth_realm_id, auth_client_id, auth_user_id, ip_address, resource_path, representation, error, resource_type) FROM stdin;
\.


--
-- Data for Name: associated_policy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.associated_policy (policy_id, associated_policy_id) FROM stdin;
\.


--
-- Data for Name: authentication_execution; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authentication_execution (id, alias, authenticator, realm_id, flow_id, requirement, priority, authenticator_flow, auth_flow_id, auth_config) FROM stdin;
46856c86-cb49-4bef-9cb2-5b59967f5d31	\N	auth-cookie	cb657751-60e1-4583-91be-f6ae0b5826d5	824d98d0-6257-4642-9cc1-27521295820b	2	10	f	\N	\N
42f89d67-091d-4731-9f24-f9fa657612b1	\N	auth-spnego	cb657751-60e1-4583-91be-f6ae0b5826d5	824d98d0-6257-4642-9cc1-27521295820b	3	20	f	\N	\N
506bd311-95fd-446f-991c-6007f477d327	\N	identity-provider-redirector	cb657751-60e1-4583-91be-f6ae0b5826d5	824d98d0-6257-4642-9cc1-27521295820b	2	25	f	\N	\N
7f46a9ef-4006-49eb-9188-0af55685ca04	\N	\N	cb657751-60e1-4583-91be-f6ae0b5826d5	824d98d0-6257-4642-9cc1-27521295820b	2	30	t	29fd2162-541f-4fd9-82db-75473fc7ccac	\N
6024720f-b656-4f5a-942d-5a959217ceb4	\N	auth-username-password-form	cb657751-60e1-4583-91be-f6ae0b5826d5	29fd2162-541f-4fd9-82db-75473fc7ccac	0	10	f	\N	\N
eaa74696-8f81-4572-80aa-374a1c612dc6	\N	\N	cb657751-60e1-4583-91be-f6ae0b5826d5	29fd2162-541f-4fd9-82db-75473fc7ccac	1	20	t	eea7c258-3342-44f9-8cfd-90a1c282c719	\N
f2c4a82f-a9c3-4202-a14e-92dcca08d200	\N	conditional-user-configured	cb657751-60e1-4583-91be-f6ae0b5826d5	eea7c258-3342-44f9-8cfd-90a1c282c719	0	10	f	\N	\N
a4e789fe-c5c0-409b-a189-100dcaf83c10	\N	auth-otp-form	cb657751-60e1-4583-91be-f6ae0b5826d5	eea7c258-3342-44f9-8cfd-90a1c282c719	0	20	f	\N	\N
11af8bb8-84b8-40dc-b5f9-27d479d76358	\N	direct-grant-validate-username	cb657751-60e1-4583-91be-f6ae0b5826d5	ec3cc918-98ca-4c7c-b324-6894cf211658	0	10	f	\N	\N
c6d3e436-522d-45b5-a0b9-8ca7cd469b18	\N	direct-grant-validate-password	cb657751-60e1-4583-91be-f6ae0b5826d5	ec3cc918-98ca-4c7c-b324-6894cf211658	0	20	f	\N	\N
a35c47d6-386b-478f-83fe-da070ebf336b	\N	\N	cb657751-60e1-4583-91be-f6ae0b5826d5	ec3cc918-98ca-4c7c-b324-6894cf211658	1	30	t	faa93903-3406-4163-8433-002c722166ad	\N
571cad59-ba49-430d-a6b3-d1015205a9ef	\N	conditional-user-configured	cb657751-60e1-4583-91be-f6ae0b5826d5	faa93903-3406-4163-8433-002c722166ad	0	10	f	\N	\N
01f32678-9133-4d50-b47c-cdd60081e077	\N	direct-grant-validate-otp	cb657751-60e1-4583-91be-f6ae0b5826d5	faa93903-3406-4163-8433-002c722166ad	0	20	f	\N	\N
a7b05e01-7b97-4631-bdb7-fdc106f6c79c	\N	registration-page-form	cb657751-60e1-4583-91be-f6ae0b5826d5	b829f8ea-4a30-4fda-9ea7-a64e0a9e350b	0	10	t	5122922b-efc9-497d-93f1-8fe2577f97db	\N
8dd2f4c1-a3f5-4f21-88a7-62e2c01b6048	\N	registration-user-creation	cb657751-60e1-4583-91be-f6ae0b5826d5	5122922b-efc9-497d-93f1-8fe2577f97db	0	20	f	\N	\N
5c64cf04-e4a0-407a-bd5c-3186faa4b640	\N	registration-profile-action	cb657751-60e1-4583-91be-f6ae0b5826d5	5122922b-efc9-497d-93f1-8fe2577f97db	0	40	f	\N	\N
b94d7143-3f04-4cc4-b8a8-f9434d7f088b	\N	registration-password-action	cb657751-60e1-4583-91be-f6ae0b5826d5	5122922b-efc9-497d-93f1-8fe2577f97db	0	50	f	\N	\N
adc694fa-5493-4d66-bb7e-58b0d6c8f5ff	\N	registration-recaptcha-action	cb657751-60e1-4583-91be-f6ae0b5826d5	5122922b-efc9-497d-93f1-8fe2577f97db	3	60	f	\N	\N
d50d35e1-af8f-4901-9824-3e54c961c37d	\N	reset-credentials-choose-user	cb657751-60e1-4583-91be-f6ae0b5826d5	e41759a2-254d-4713-b3e9-c9e57a04014d	0	10	f	\N	\N
d2ac64d6-8c24-4c79-ad78-9ca81a77a4d5	\N	reset-credential-email	cb657751-60e1-4583-91be-f6ae0b5826d5	e41759a2-254d-4713-b3e9-c9e57a04014d	0	20	f	\N	\N
d4b66f58-62ef-42d0-b381-bc90865a311a	\N	reset-password	cb657751-60e1-4583-91be-f6ae0b5826d5	e41759a2-254d-4713-b3e9-c9e57a04014d	0	30	f	\N	\N
51c1d4bd-878f-48f6-9a7a-fdaa0fa1c8e2	\N	\N	cb657751-60e1-4583-91be-f6ae0b5826d5	e41759a2-254d-4713-b3e9-c9e57a04014d	1	40	t	2d031614-b5c3-49db-9be1-df83851e7c81	\N
7141365a-22d4-4d02-a8b5-f921fcc9d3a3	\N	conditional-user-configured	cb657751-60e1-4583-91be-f6ae0b5826d5	2d031614-b5c3-49db-9be1-df83851e7c81	0	10	f	\N	\N
29b33f0f-8cb1-45a9-a645-813209240200	\N	reset-otp	cb657751-60e1-4583-91be-f6ae0b5826d5	2d031614-b5c3-49db-9be1-df83851e7c81	0	20	f	\N	\N
bc8a9aa5-dffc-4d2d-b2dc-209132617f3c	\N	client-secret	cb657751-60e1-4583-91be-f6ae0b5826d5	3c8980f4-b1cc-415e-be90-9acf10d88247	2	10	f	\N	\N
77ca6195-fa45-4be3-bcc7-fa8b18f208fe	\N	client-jwt	cb657751-60e1-4583-91be-f6ae0b5826d5	3c8980f4-b1cc-415e-be90-9acf10d88247	2	20	f	\N	\N
73f893d7-863f-4509-b6a8-839d05d3f10b	\N	client-secret-jwt	cb657751-60e1-4583-91be-f6ae0b5826d5	3c8980f4-b1cc-415e-be90-9acf10d88247	2	30	f	\N	\N
e3501718-b6a4-4eb3-9a70-5ff630c788b7	\N	client-x509	cb657751-60e1-4583-91be-f6ae0b5826d5	3c8980f4-b1cc-415e-be90-9acf10d88247	2	40	f	\N	\N
510f6b79-8340-4f4e-8a56-01476843a355	\N	idp-review-profile	cb657751-60e1-4583-91be-f6ae0b5826d5	c074f8c1-6a2e-4f75-9a23-9ae5bae874d5	0	10	f	\N	205981f7-3055-45f4-8d69-3b3e19d3b664
dbef9308-fdc8-412b-8785-2a6147470f74	\N	\N	cb657751-60e1-4583-91be-f6ae0b5826d5	c074f8c1-6a2e-4f75-9a23-9ae5bae874d5	0	20	t	596917cc-91f7-4497-a32f-fd88f77d6f94	\N
b435ba46-3f21-40f3-9795-d45f6fbb470e	\N	idp-create-user-if-unique	cb657751-60e1-4583-91be-f6ae0b5826d5	596917cc-91f7-4497-a32f-fd88f77d6f94	2	10	f	\N	10d9857d-1c7b-40f8-994b-93a9666e1ec4
0cfc6f5c-2d9e-43d9-8e91-8699a7b959b0	\N	\N	cb657751-60e1-4583-91be-f6ae0b5826d5	596917cc-91f7-4497-a32f-fd88f77d6f94	2	20	t	b77ed14a-f2dc-4e0d-b043-1db25da1602d	\N
e5c3e412-1189-4bed-be46-a5ac5fc1d452	\N	idp-confirm-link	cb657751-60e1-4583-91be-f6ae0b5826d5	b77ed14a-f2dc-4e0d-b043-1db25da1602d	0	10	f	\N	\N
a7ff750a-f43f-4af5-81fe-ae1043cadffa	\N	\N	cb657751-60e1-4583-91be-f6ae0b5826d5	b77ed14a-f2dc-4e0d-b043-1db25da1602d	0	20	t	c3283fa2-993f-415c-a0ec-f439cf1119af	\N
6b2ac884-51dc-4e69-a540-ce223d137b58	\N	idp-email-verification	cb657751-60e1-4583-91be-f6ae0b5826d5	c3283fa2-993f-415c-a0ec-f439cf1119af	2	10	f	\N	\N
c8fd8ec9-7ac8-42d1-be7b-fd7fbff149e5	\N	\N	cb657751-60e1-4583-91be-f6ae0b5826d5	c3283fa2-993f-415c-a0ec-f439cf1119af	2	20	t	d864c6c3-cf41-46cd-b8db-6eaa5f83f6be	\N
cda4359c-13ae-4507-92a0-a1bcee0f5f49	\N	idp-username-password-form	cb657751-60e1-4583-91be-f6ae0b5826d5	d864c6c3-cf41-46cd-b8db-6eaa5f83f6be	0	10	f	\N	\N
ce451e7c-7cd3-4f30-9cdf-597411d36375	\N	\N	cb657751-60e1-4583-91be-f6ae0b5826d5	d864c6c3-cf41-46cd-b8db-6eaa5f83f6be	1	20	t	7af89bb9-7949-45d3-90c7-aef9457dc592	\N
fcaf3942-16f3-48a5-a9e6-073c7a196b45	\N	conditional-user-configured	cb657751-60e1-4583-91be-f6ae0b5826d5	7af89bb9-7949-45d3-90c7-aef9457dc592	0	10	f	\N	\N
0bb73194-f82e-475f-aea0-52971498d2e3	\N	auth-otp-form	cb657751-60e1-4583-91be-f6ae0b5826d5	7af89bb9-7949-45d3-90c7-aef9457dc592	0	20	f	\N	\N
6be2679e-ff31-47e9-ad98-27e3750cae98	\N	http-basic-authenticator	cb657751-60e1-4583-91be-f6ae0b5826d5	57ec46fd-0200-4154-a067-402cda9e8941	0	10	f	\N	\N
63d2adab-2b77-4ea2-8c37-7b6e8bfa3457	\N	docker-http-basic-authenticator	cb657751-60e1-4583-91be-f6ae0b5826d5	044a8483-d9a9-4c24-adb3-a1fd2093ef1b	0	10	f	\N	\N
e62247ec-ef68-419a-a40a-2e7f8cf80aaf	\N	no-cookie-redirect	cb657751-60e1-4583-91be-f6ae0b5826d5	64cc932a-5cfc-4eae-83aa-b5d2e6af3c7b	0	10	f	\N	\N
2ae981b2-e5e6-4635-b680-408332f00b78	\N	\N	cb657751-60e1-4583-91be-f6ae0b5826d5	64cc932a-5cfc-4eae-83aa-b5d2e6af3c7b	0	20	t	bb21d0b3-8c0d-4298-ba41-688b24604de5	\N
2ea3021f-ec10-48d7-81d9-f365afd50aff	\N	basic-auth	cb657751-60e1-4583-91be-f6ae0b5826d5	bb21d0b3-8c0d-4298-ba41-688b24604de5	0	10	f	\N	\N
4156e687-af10-486f-a24b-318f137dcfb6	\N	basic-auth-otp	cb657751-60e1-4583-91be-f6ae0b5826d5	bb21d0b3-8c0d-4298-ba41-688b24604de5	3	20	f	\N	\N
1a309bc9-2895-455f-9e51-4b1139b1670f	\N	auth-spnego	cb657751-60e1-4583-91be-f6ae0b5826d5	bb21d0b3-8c0d-4298-ba41-688b24604de5	3	30	f	\N	\N
e913a4ac-f615-4fce-9b20-a685466003d0	\N	auth-cookie	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	e2279fbd-5be9-49b6-b9dd-55a0efaf0885	2	10	f	\N	\N
fb45403a-ab5a-4739-b310-2b98893581e4	\N	auth-spnego	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	e2279fbd-5be9-49b6-b9dd-55a0efaf0885	3	20	f	\N	\N
4fa22deb-adc9-4479-99cb-46b8a4dd3c10	\N	identity-provider-redirector	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	e2279fbd-5be9-49b6-b9dd-55a0efaf0885	2	25	f	\N	\N
fa380f55-d08c-4afd-9e4f-642150cdc223	\N	\N	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	e2279fbd-5be9-49b6-b9dd-55a0efaf0885	2	30	t	c5dd71a0-adde-4299-bd6c-32924a20a974	\N
a2f7b43b-5477-41bc-a7f6-2c3fe9ddf5ef	\N	auth-username-password-form	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	c5dd71a0-adde-4299-bd6c-32924a20a974	0	10	f	\N	\N
07998e4e-7b00-4431-8c4c-e86801d47893	\N	\N	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	c5dd71a0-adde-4299-bd6c-32924a20a974	1	20	t	0990e485-03a5-4953-bc85-22151639eac0	\N
476927c7-1777-4e64-a660-c2c537c1ebf9	\N	conditional-user-configured	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	0990e485-03a5-4953-bc85-22151639eac0	0	10	f	\N	\N
4a929f75-7da2-4893-afc4-feec9785507e	\N	auth-otp-form	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	0990e485-03a5-4953-bc85-22151639eac0	0	20	f	\N	\N
10041aec-a0c2-45f2-80a9-dd5700024706	\N	direct-grant-validate-username	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	715f3241-6ab6-4b2d-acb9-bcb3a6736c83	0	10	f	\N	\N
9c03b6a9-5853-4791-baa3-11a10262ed30	\N	direct-grant-validate-password	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	715f3241-6ab6-4b2d-acb9-bcb3a6736c83	0	20	f	\N	\N
38733af1-0630-4829-b3e6-a73e057eb24f	\N	\N	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	715f3241-6ab6-4b2d-acb9-bcb3a6736c83	1	30	t	80850826-32ef-4178-803d-fd094f7d08c4	\N
0b200b7b-acf8-40bb-9af3-26d9225e837f	\N	conditional-user-configured	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	80850826-32ef-4178-803d-fd094f7d08c4	0	10	f	\N	\N
93232bd7-1cc7-468a-a114-68641ad02b55	\N	direct-grant-validate-otp	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	80850826-32ef-4178-803d-fd094f7d08c4	0	20	f	\N	\N
93710368-d941-46f6-ab2f-b82796dfc655	\N	registration-page-form	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	99971b15-950c-44e8-854c-14bbed884480	0	10	t	dd356fb8-5792-4f39-a51b-6fc691f66e9b	\N
8772fee9-020a-40b7-a182-1aadd4ff203b	\N	registration-user-creation	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	dd356fb8-5792-4f39-a51b-6fc691f66e9b	0	20	f	\N	\N
5424cb85-ebaf-4424-952a-5033830ce7b1	\N	registration-profile-action	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	dd356fb8-5792-4f39-a51b-6fc691f66e9b	0	40	f	\N	\N
e7788242-418c-44da-9875-857b4ba63840	\N	registration-password-action	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	dd356fb8-5792-4f39-a51b-6fc691f66e9b	0	50	f	\N	\N
94aece99-4a0d-4424-bd25-0ac49550ebf1	\N	registration-recaptcha-action	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	dd356fb8-5792-4f39-a51b-6fc691f66e9b	3	60	f	\N	\N
8e083fcf-1b5b-4c4a-a915-0af29c23dfe8	\N	reset-credentials-choose-user	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	b007571d-788f-470f-98b7-d095b433cf62	0	10	f	\N	\N
736f3c53-85f6-41d0-9378-42c3a15b112f	\N	reset-credential-email	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	b007571d-788f-470f-98b7-d095b433cf62	0	20	f	\N	\N
9ab45c90-f2ef-479b-a78c-cdb922284d7a	\N	reset-password	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	b007571d-788f-470f-98b7-d095b433cf62	0	30	f	\N	\N
0fee75fb-6cf9-4727-8488-56ec8523a56d	\N	\N	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	b007571d-788f-470f-98b7-d095b433cf62	1	40	t	2b09ef3d-f25a-48b6-99d4-54e71ce9db41	\N
c96cb95a-5973-470e-9684-00b7381c9bdd	\N	conditional-user-configured	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	2b09ef3d-f25a-48b6-99d4-54e71ce9db41	0	10	f	\N	\N
796181ff-befb-4322-94e7-190f2c3e6e1c	\N	reset-otp	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	2b09ef3d-f25a-48b6-99d4-54e71ce9db41	0	20	f	\N	\N
bd6ebd11-dc94-4f4a-83e0-45e8981037e6	\N	client-secret	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	a2df0055-044c-41da-807b-fac4fe3c3ecc	2	10	f	\N	\N
c86751d2-1aa4-4933-9a98-d64ce43a7d9d	\N	client-jwt	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	a2df0055-044c-41da-807b-fac4fe3c3ecc	2	20	f	\N	\N
414460b5-0f35-458f-8c8b-982e33fc33fa	\N	client-secret-jwt	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	a2df0055-044c-41da-807b-fac4fe3c3ecc	2	30	f	\N	\N
19e93fb7-4eae-48dd-af21-d326da011da5	\N	client-x509	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	a2df0055-044c-41da-807b-fac4fe3c3ecc	2	40	f	\N	\N
c8118881-192f-4595-97c5-77c4e5d5a356	\N	idp-review-profile	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	972128fd-ca55-42c5-8f04-1cbf1c6e32c8	0	10	f	\N	d4361dbf-d270-4560-9b7a-210914285dd7
8d59b57e-9e2b-405b-a808-bf0903ccbac7	\N	\N	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	972128fd-ca55-42c5-8f04-1cbf1c6e32c8	0	20	t	a6e748f6-02a3-459c-b682-c854f22ae21e	\N
cb2d2f9f-1d6a-4ab7-a54d-1a051fe443bf	\N	idp-create-user-if-unique	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	a6e748f6-02a3-459c-b682-c854f22ae21e	2	10	f	\N	36de875c-56fd-4ed4-9fff-ff3c9a979596
14320b9e-b101-41cd-b5f1-f7c2d36dd1e8	\N	\N	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	a6e748f6-02a3-459c-b682-c854f22ae21e	2	20	t	431dbf2d-ebb8-40fc-b419-c97e6719572c	\N
d6fc73d0-795a-4491-9395-1d0cca2822bf	\N	idp-confirm-link	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	431dbf2d-ebb8-40fc-b419-c97e6719572c	0	10	f	\N	\N
4040fd0a-a300-4e61-85c1-36eeb61a707c	\N	\N	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	431dbf2d-ebb8-40fc-b419-c97e6719572c	0	20	t	8debc432-a0a9-4c5c-a7a6-6f902ab2d738	\N
139cb585-dbef-4084-bfc3-84d69977ab19	\N	idp-email-verification	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	8debc432-a0a9-4c5c-a7a6-6f902ab2d738	2	10	f	\N	\N
a5de7eaf-38c6-4189-9c9f-1e08c4c5d8f4	\N	\N	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	8debc432-a0a9-4c5c-a7a6-6f902ab2d738	2	20	t	8bdfd3f7-28d6-43ed-9bef-d7b3cd0b4452	\N
eee7a02c-7a59-486f-aa4a-5ec4a82ccc08	\N	idp-username-password-form	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	8bdfd3f7-28d6-43ed-9bef-d7b3cd0b4452	0	10	f	\N	\N
ec812254-280e-4ae3-a122-62897d676350	\N	\N	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	8bdfd3f7-28d6-43ed-9bef-d7b3cd0b4452	1	20	t	ffb57412-901a-43f1-b586-bb39efeb1488	\N
ac2274a7-ea9c-46b6-bf06-c3bdfa53dfe3	\N	conditional-user-configured	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	ffb57412-901a-43f1-b586-bb39efeb1488	0	10	f	\N	\N
876f2c6b-e7d6-4225-880e-303a1a45b1d6	\N	auth-otp-form	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	ffb57412-901a-43f1-b586-bb39efeb1488	0	20	f	\N	\N
47e3ec3e-964d-4f98-a70a-0f9bd6f1bd30	\N	http-basic-authenticator	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	583d1d93-8c0a-4ecc-bf02-abf75cc45495	0	10	f	\N	\N
ebdd46d4-fa06-42b2-a168-44b1deecb2c0	\N	docker-http-basic-authenticator	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	cf26b88f-1a2c-423a-81fc-34399a6aeff3	0	10	f	\N	\N
94acc2af-4e8e-430f-8652-2859304cb715	\N	no-cookie-redirect	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	e2965460-75c2-480c-b72a-e3431cf4896a	0	10	f	\N	\N
9ed0aa26-bfe3-4572-a3f3-c9f0316eddcd	\N	\N	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	e2965460-75c2-480c-b72a-e3431cf4896a	0	20	t	6f1eb849-29d0-48de-b473-65865ea33bf3	\N
667146fd-a377-4cfc-993e-ddecd2f2fe27	\N	basic-auth	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	6f1eb849-29d0-48de-b473-65865ea33bf3	0	10	f	\N	\N
6b09b20d-aef3-46f8-9862-6a86d4dd008b	\N	basic-auth-otp	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	6f1eb849-29d0-48de-b473-65865ea33bf3	3	20	f	\N	\N
067e8726-eaec-4b74-95c1-1d04289aedf2	\N	auth-spnego	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	6f1eb849-29d0-48de-b473-65865ea33bf3	3	30	f	\N	\N
\.


--
-- Data for Name: authentication_flow; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authentication_flow (id, alias, description, realm_id, provider_id, top_level, built_in) FROM stdin;
824d98d0-6257-4642-9cc1-27521295820b	browser	browser based authentication	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	t	t
29fd2162-541f-4fd9-82db-75473fc7ccac	forms	Username, password, otp and other auth forms.	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	f	t
eea7c258-3342-44f9-8cfd-90a1c282c719	Browser - Conditional OTP	Flow to determine if the OTP is required for the authentication	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	f	t
ec3cc918-98ca-4c7c-b324-6894cf211658	direct grant	OpenID Connect Resource Owner Grant	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	t	t
faa93903-3406-4163-8433-002c722166ad	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	f	t
b829f8ea-4a30-4fda-9ea7-a64e0a9e350b	registration	registration flow	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	t	t
5122922b-efc9-497d-93f1-8fe2577f97db	registration form	registration form	cb657751-60e1-4583-91be-f6ae0b5826d5	form-flow	f	t
e41759a2-254d-4713-b3e9-c9e57a04014d	reset credentials	Reset credentials for a user if they forgot their password or something	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	t	t
2d031614-b5c3-49db-9be1-df83851e7c81	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	f	t
3c8980f4-b1cc-415e-be90-9acf10d88247	clients	Base authentication for clients	cb657751-60e1-4583-91be-f6ae0b5826d5	client-flow	t	t
c074f8c1-6a2e-4f75-9a23-9ae5bae874d5	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	t	t
596917cc-91f7-4497-a32f-fd88f77d6f94	User creation or linking	Flow for the existing/non-existing user alternatives	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	f	t
b77ed14a-f2dc-4e0d-b043-1db25da1602d	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	f	t
c3283fa2-993f-415c-a0ec-f439cf1119af	Account verification options	Method with which to verity the existing account	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	f	t
d864c6c3-cf41-46cd-b8db-6eaa5f83f6be	Verify Existing Account by Re-authentication	Reauthentication of existing account	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	f	t
7af89bb9-7949-45d3-90c7-aef9457dc592	First broker login - Conditional OTP	Flow to determine if the OTP is required for the authentication	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	f	t
57ec46fd-0200-4154-a067-402cda9e8941	saml ecp	SAML ECP Profile Authentication Flow	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	t	t
044a8483-d9a9-4c24-adb3-a1fd2093ef1b	docker auth	Used by Docker clients to authenticate against the IDP	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	t	t
64cc932a-5cfc-4eae-83aa-b5d2e6af3c7b	http challenge	An authentication flow based on challenge-response HTTP Authentication Schemes	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	t	t
bb21d0b3-8c0d-4298-ba41-688b24604de5	Authentication Options	Authentication options.	cb657751-60e1-4583-91be-f6ae0b5826d5	basic-flow	f	t
e2279fbd-5be9-49b6-b9dd-55a0efaf0885	browser	browser based authentication	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	t	t
c5dd71a0-adde-4299-bd6c-32924a20a974	forms	Username, password, otp and other auth forms.	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	f	t
0990e485-03a5-4953-bc85-22151639eac0	Browser - Conditional OTP	Flow to determine if the OTP is required for the authentication	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	f	t
715f3241-6ab6-4b2d-acb9-bcb3a6736c83	direct grant	OpenID Connect Resource Owner Grant	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	t	t
80850826-32ef-4178-803d-fd094f7d08c4	Direct Grant - Conditional OTP	Flow to determine if the OTP is required for the authentication	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	f	t
99971b15-950c-44e8-854c-14bbed884480	registration	registration flow	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	t	t
dd356fb8-5792-4f39-a51b-6fc691f66e9b	registration form	registration form	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	form-flow	f	t
b007571d-788f-470f-98b7-d095b433cf62	reset credentials	Reset credentials for a user if they forgot their password or something	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	t	t
2b09ef3d-f25a-48b6-99d4-54e71ce9db41	Reset - Conditional OTP	Flow to determine if the OTP should be reset or not. Set to REQUIRED to force.	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	f	t
a2df0055-044c-41da-807b-fac4fe3c3ecc	clients	Base authentication for clients	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	client-flow	t	t
972128fd-ca55-42c5-8f04-1cbf1c6e32c8	first broker login	Actions taken after first broker login with identity provider account, which is not yet linked to any Keycloak account	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	t	t
a6e748f6-02a3-459c-b682-c854f22ae21e	User creation or linking	Flow for the existing/non-existing user alternatives	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	f	t
431dbf2d-ebb8-40fc-b419-c97e6719572c	Handle Existing Account	Handle what to do if there is existing account with same email/username like authenticated identity provider	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	f	t
8debc432-a0a9-4c5c-a7a6-6f902ab2d738	Account verification options	Method with which to verity the existing account	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	f	t
8bdfd3f7-28d6-43ed-9bef-d7b3cd0b4452	Verify Existing Account by Re-authentication	Reauthentication of existing account	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	f	t
ffb57412-901a-43f1-b586-bb39efeb1488	First broker login - Conditional OTP	Flow to determine if the OTP is required for the authentication	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	f	t
583d1d93-8c0a-4ecc-bf02-abf75cc45495	saml ecp	SAML ECP Profile Authentication Flow	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	t	t
cf26b88f-1a2c-423a-81fc-34399a6aeff3	docker auth	Used by Docker clients to authenticate against the IDP	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	t	t
e2965460-75c2-480c-b72a-e3431cf4896a	http challenge	An authentication flow based on challenge-response HTTP Authentication Schemes	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	t	t
6f1eb849-29d0-48de-b473-65865ea33bf3	Authentication Options	Authentication options.	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	basic-flow	f	t
\.


--
-- Data for Name: authenticator_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authenticator_config (id, alias, realm_id) FROM stdin;
205981f7-3055-45f4-8d69-3b3e19d3b664	review profile config	cb657751-60e1-4583-91be-f6ae0b5826d5
10d9857d-1c7b-40f8-994b-93a9666e1ec4	create unique user config	cb657751-60e1-4583-91be-f6ae0b5826d5
d4361dbf-d270-4560-9b7a-210914285dd7	review profile config	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf
36de875c-56fd-4ed4-9fff-ff3c9a979596	create unique user config	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf
\.


--
-- Data for Name: authenticator_config_entry; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authenticator_config_entry (authenticator_id, value, name) FROM stdin;
10d9857d-1c7b-40f8-994b-93a9666e1ec4	false	require.password.update.after.registration
205981f7-3055-45f4-8d69-3b3e19d3b664	missing	update.profile.on.first.login
                                                         36de875c-56fd-4ed4-9fff-ff3c9a979596	false	require.password.update.after.registration
                                                         d4361dbf-d270-4560-9b7a-210914285dd7	missing	update.profile.on.first.login
                                                                                                          \.


--
-- Data for Name: broker_link; Type: TABLE DATA; Schema: public; Owner: admin
--

                                                                                                          COPY public.broker_link (identity_provider, storage_provider_id, realm_id, broker_user_id, broker_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client (id, enabled, full_scope_allowed, client_id, not_before, public_client, secret, base_url, bearer_only, management_url, surrogate_auth_required, realm_id, protocol, node_rereg_timeout, frontchannel_logout, consent_required, name, service_accounts_enabled, client_authenticator_type, root_url, description, registration_token, standard_flow_enabled, implicit_flow_enabled, direct_access_grants_enabled, always_display_in_console) FROM stdin;
7018dd8d-2b35-442e-b684-e295c562db46	t	f	master-realm	0	f	\N	\N	t	\N	f	cb657751-60e1-4583-91be-f6ae0b5826d5	\N	0	f	f	master Realm	f	client-secret	\N	\N	\N	t	f	f	f
410044cd-6864-4906-ae80-06d3ff41ebc9	t	f	account	0	t	\N	/realms/master/account/	f	\N	f	cb657751-60e1-4583-91be-f6ae0b5826d5	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
5310f114-a195-4a7e-baa7-b097f62d911a	t	f	account-console	0	t	\N	/realms/master/account/	f	\N	f	cb657751-60e1-4583-91be-f6ae0b5826d5	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
dba9cbf4-3729-4037-93bc-3abf30da1779	t	f	broker	0	f	\N	\N	t	\N	f	cb657751-60e1-4583-91be-f6ae0b5826d5	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	t	f	security-admin-console	0	t	\N	/admin/master/console/	f	\N	f	cb657751-60e1-4583-91be-f6ae0b5826d5	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
846c0b3f-7bdd-4609-be2c-8d894e2ab90b	t	f	admin-cli	0	t	\N	\N	f	\N	f	cb657751-60e1-4583-91be-f6ae0b5826d5	openid-connect	0	f	f	${client_admin-cli}	f	client-secret	\N	\N	\N	f	f	t	f
d9029962-3755-499d-9a33-f672bb030535	t	f	mainzelliste-realm	0	f	\N	\N	t	\N	f	cb657751-60e1-4583-91be-f6ae0b5826d5	\N	0	f	f	mainzelliste Realm	f	client-secret	\N	\N	\N	t	f	f	f
daaf56e1-3e6d-4255-88a4-04e0d9312666	t	f	realm-management	0	f	\N	\N	t	\N	f	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	openid-connect	0	f	f	${client_realm-management}	f	client-secret	\N	\N	\N	t	f	f	f
2ef8ef9a-6b19-45db-99ba-819589ddda1e	t	f	account	0	t	\N	/realms/mainzelliste/account/	f	\N	f	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	openid-connect	0	f	f	${client_account}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
f95ce717-e6e3-45da-9312-22644eceb667	t	f	account-console	0	t	\N	/realms/mainzelliste/account/	f	\N	f	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	openid-connect	0	f	f	${client_account-console}	f	client-secret	${authBaseUrl}	\N	\N	t	f	f	f
4df2fd4c-f1d3-49cd-832a-2981aabcc3be	t	f	broker	0	f	\N	\N	t	\N	f	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	openid-connect	0	f	f	${client_broker}	f	client-secret	\N	\N	\N	t	f	f	f
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	t	f	security-admin-console	0	t	\N	/admin/mainzelliste/console/	f	\N	f	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	openid-connect	0	f	f	${client_security-admin-console}	f	client-secret	${authAdminUrl}	\N	\N	t	f	f	f
40b2864c-d64d-42a6-8703-38bdf1c379e4	t	f	admin-cli	0	t	\N	\N	f	\N	f	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	openid-connect	0	f	f	${client_admin-cli}	f	client-secret	\N	\N	\N	f	f	t	f
28e7349b-8356-490d-8630-bd9aad26f316	t	t	mainzelliste-ui	0	t	\N	http://localhost	f		f	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	openid-connect	-1	t	f		f	client-secret	http://localhost		\N	t	f	t	f
\.


--
-- Data for Name: client_attributes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_attributes (client_id, name, value) FROM stdin;
410044cd-6864-4906-ae80-06d3ff41ebc9	post.logout.redirect.uris	+
5310f114-a195-4a7e-baa7-b097f62d911a	post.logout.redirect.uris	+
5310f114-a195-4a7e-baa7-b097f62d911a	pkce.code.challenge.method	S256
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	post.logout.redirect.uris	+
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	pkce.code.challenge.method	S256
2ef8ef9a-6b19-45db-99ba-819589ddda1e	post.logout.redirect.uris	+
f95ce717-e6e3-45da-9312-22644eceb667	post.logout.redirect.uris	+
f95ce717-e6e3-45da-9312-22644eceb667	pkce.code.challenge.method	S256
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	post.logout.redirect.uris	+
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	pkce.code.challenge.method	S256
28e7349b-8356-490d-8630-bd9aad26f316	oauth2.device.authorization.grant.enabled	false
28e7349b-8356-490d-8630-bd9aad26f316	oidc.ciba.grant.enabled	false
28e7349b-8356-490d-8630-bd9aad26f316	backchannel.logout.session.required	true
28e7349b-8356-490d-8630-bd9aad26f316	backchannel.logout.revoke.offline.tokens	false
28e7349b-8356-490d-8630-bd9aad26f316	login_theme	mainzelliste
28e7349b-8356-490d-8630-bd9aad26f316	display.on.consent.screen	false
28e7349b-8356-490d-8630-bd9aad26f316	post.logout.redirect.uris	http://localhost/*
\.


--
-- Data for Name: client_auth_flow_bindings; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_auth_flow_bindings (client_id, flow_id, binding_name) FROM stdin;
\.


--
-- Data for Name: client_initial_access; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_initial_access (id, realm_id, "timestamp", expiration, count, remaining_count) FROM stdin;
\.


--
-- Data for Name: client_node_registrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_node_registrations (client_id, value, name) FROM stdin;
\.


--
-- Data for Name: client_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_scope (id, name, realm_id, description, protocol) FROM stdin;
7598e7f2-dbae-4657-bd9a-e6e7b80b683a	offline_access	cb657751-60e1-4583-91be-f6ae0b5826d5	OpenID Connect built-in scope: offline_access	openid-connect
0561e09b-0776-4650-80c0-b4769a02d63a	role_list	cb657751-60e1-4583-91be-f6ae0b5826d5	SAML role list	saml
0410aa29-458c-418d-9097-b54e3f68460c	profile	cb657751-60e1-4583-91be-f6ae0b5826d5	OpenID Connect built-in scope: profile	openid-connect
af32fa91-fd8a-4142-9a2f-cd5e04c61f61	email	cb657751-60e1-4583-91be-f6ae0b5826d5	OpenID Connect built-in scope: email	openid-connect
f9711ac9-2c44-4d0d-a281-926d355c19af	address	cb657751-60e1-4583-91be-f6ae0b5826d5	OpenID Connect built-in scope: address	openid-connect
5a83a323-4899-4241-a0cd-5f555dec2719	phone	cb657751-60e1-4583-91be-f6ae0b5826d5	OpenID Connect built-in scope: phone	openid-connect
618562ba-a542-447e-8b16-68351e2ee465	roles	cb657751-60e1-4583-91be-f6ae0b5826d5	OpenID Connect scope for add user roles to the access token	openid-connect
9543b9a7-54ab-45bc-b657-8bb53604d2ff	web-origins	cb657751-60e1-4583-91be-f6ae0b5826d5	OpenID Connect scope for add allowed web origins to the access token	openid-connect
b45bda6d-0232-4354-909e-6bb095ed6fca	microprofile-jwt	cb657751-60e1-4583-91be-f6ae0b5826d5	Microprofile - JWT built-in scope	openid-connect
f584b95f-51a7-444e-b77f-0dd99e69a55e	acr	cb657751-60e1-4583-91be-f6ae0b5826d5	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
6f0fb755-373f-4e0a-8266-2901c8064c19	offline_access	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	OpenID Connect built-in scope: offline_access	openid-connect
2323b68d-0c37-414c-af0a-00ba5027d928	role_list	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	SAML role list	saml
7430d820-79aa-4941-9514-b90fb5bf8bda	profile	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	OpenID Connect built-in scope: profile	openid-connect
198b19b7-eb14-48a2-a93e-777e550efa0f	email	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	OpenID Connect built-in scope: email	openid-connect
99137542-ae7d-41c9-a837-c0f731719a5b	address	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	OpenID Connect built-in scope: address	openid-connect
d02d6f13-a231-4baa-abde-d138cb50e380	phone	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	OpenID Connect built-in scope: phone	openid-connect
036b53ee-aa81-48fb-9708-c7a311055ed3	roles	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	OpenID Connect scope for add user roles to the access token	openid-connect
394978fc-531e-498a-b928-48d65b1fa1a9	web-origins	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	OpenID Connect scope for add allowed web origins to the access token	openid-connect
3897407b-0338-4aec-8402-b81918290d6c	microprofile-jwt	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	Microprofile - JWT built-in scope	openid-connect
15c94410-a2f6-4cc8-8a80-21483730906e	acr	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	OpenID Connect scope for add acr (authentication context class reference) to the token	openid-connect
\.


--
-- Data for Name: client_scope_attributes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_scope_attributes (scope_id, value, name) FROM stdin;
7598e7f2-dbae-4657-bd9a-e6e7b80b683a	true	display.on.consent.screen
7598e7f2-dbae-4657-bd9a-e6e7b80b683a	${offlineAccessScopeConsentText}	consent.screen.text
0561e09b-0776-4650-80c0-b4769a02d63a	true	display.on.consent.screen
0561e09b-0776-4650-80c0-b4769a02d63a	${samlRoleListScopeConsentText}	consent.screen.text
0410aa29-458c-418d-9097-b54e3f68460c	true	display.on.consent.screen
0410aa29-458c-418d-9097-b54e3f68460c	${profileScopeConsentText}	consent.screen.text
0410aa29-458c-418d-9097-b54e3f68460c	true	include.in.token.scope
af32fa91-fd8a-4142-9a2f-cd5e04c61f61	true	display.on.consent.screen
af32fa91-fd8a-4142-9a2f-cd5e04c61f61	${emailScopeConsentText}	consent.screen.text
af32fa91-fd8a-4142-9a2f-cd5e04c61f61	true	include.in.token.scope
f9711ac9-2c44-4d0d-a281-926d355c19af	true	display.on.consent.screen
f9711ac9-2c44-4d0d-a281-926d355c19af	${addressScopeConsentText}	consent.screen.text
f9711ac9-2c44-4d0d-a281-926d355c19af	true	include.in.token.scope
5a83a323-4899-4241-a0cd-5f555dec2719	true	display.on.consent.screen
5a83a323-4899-4241-a0cd-5f555dec2719	${phoneScopeConsentText}	consent.screen.text
5a83a323-4899-4241-a0cd-5f555dec2719	true	include.in.token.scope
618562ba-a542-447e-8b16-68351e2ee465	true	display.on.consent.screen
618562ba-a542-447e-8b16-68351e2ee465	${rolesScopeConsentText}	consent.screen.text
618562ba-a542-447e-8b16-68351e2ee465	false	include.in.token.scope
9543b9a7-54ab-45bc-b657-8bb53604d2ff	false	display.on.consent.screen
9543b9a7-54ab-45bc-b657-8bb53604d2ff		consent.screen.text
9543b9a7-54ab-45bc-b657-8bb53604d2ff	false	include.in.token.scope
b45bda6d-0232-4354-909e-6bb095ed6fca	false	display.on.consent.screen
b45bda6d-0232-4354-909e-6bb095ed6fca	true	include.in.token.scope
f584b95f-51a7-444e-b77f-0dd99e69a55e	false	display.on.consent.screen
f584b95f-51a7-444e-b77f-0dd99e69a55e	false	include.in.token.scope
6f0fb755-373f-4e0a-8266-2901c8064c19	true	display.on.consent.screen
6f0fb755-373f-4e0a-8266-2901c8064c19	${offlineAccessScopeConsentText}	consent.screen.text
2323b68d-0c37-414c-af0a-00ba5027d928	true	display.on.consent.screen
2323b68d-0c37-414c-af0a-00ba5027d928	${samlRoleListScopeConsentText}	consent.screen.text
7430d820-79aa-4941-9514-b90fb5bf8bda	true	display.on.consent.screen
7430d820-79aa-4941-9514-b90fb5bf8bda	${profileScopeConsentText}	consent.screen.text
7430d820-79aa-4941-9514-b90fb5bf8bda	true	include.in.token.scope
198b19b7-eb14-48a2-a93e-777e550efa0f	true	display.on.consent.screen
198b19b7-eb14-48a2-a93e-777e550efa0f	${emailScopeConsentText}	consent.screen.text
198b19b7-eb14-48a2-a93e-777e550efa0f	true	include.in.token.scope
99137542-ae7d-41c9-a837-c0f731719a5b	true	display.on.consent.screen
99137542-ae7d-41c9-a837-c0f731719a5b	${addressScopeConsentText}	consent.screen.text
99137542-ae7d-41c9-a837-c0f731719a5b	true	include.in.token.scope
d02d6f13-a231-4baa-abde-d138cb50e380	true	display.on.consent.screen
d02d6f13-a231-4baa-abde-d138cb50e380	${phoneScopeConsentText}	consent.screen.text
d02d6f13-a231-4baa-abde-d138cb50e380	true	include.in.token.scope
036b53ee-aa81-48fb-9708-c7a311055ed3	true	display.on.consent.screen
036b53ee-aa81-48fb-9708-c7a311055ed3	${rolesScopeConsentText}	consent.screen.text
036b53ee-aa81-48fb-9708-c7a311055ed3	false	include.in.token.scope
394978fc-531e-498a-b928-48d65b1fa1a9	false	display.on.consent.screen
394978fc-531e-498a-b928-48d65b1fa1a9		consent.screen.text
394978fc-531e-498a-b928-48d65b1fa1a9	false	include.in.token.scope
3897407b-0338-4aec-8402-b81918290d6c	false	display.on.consent.screen
3897407b-0338-4aec-8402-b81918290d6c	true	include.in.token.scope
15c94410-a2f6-4cc8-8a80-21483730906e	false	display.on.consent.screen
15c94410-a2f6-4cc8-8a80-21483730906e	false	include.in.token.scope
\.


--
-- Data for Name: client_scope_client; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_scope_client (client_id, scope_id, default_scope) FROM stdin;
410044cd-6864-4906-ae80-06d3ff41ebc9	af32fa91-fd8a-4142-9a2f-cd5e04c61f61	t
410044cd-6864-4906-ae80-06d3ff41ebc9	f584b95f-51a7-444e-b77f-0dd99e69a55e	t
410044cd-6864-4906-ae80-06d3ff41ebc9	9543b9a7-54ab-45bc-b657-8bb53604d2ff	t
410044cd-6864-4906-ae80-06d3ff41ebc9	0410aa29-458c-418d-9097-b54e3f68460c	t
410044cd-6864-4906-ae80-06d3ff41ebc9	618562ba-a542-447e-8b16-68351e2ee465	t
410044cd-6864-4906-ae80-06d3ff41ebc9	7598e7f2-dbae-4657-bd9a-e6e7b80b683a	f
410044cd-6864-4906-ae80-06d3ff41ebc9	f9711ac9-2c44-4d0d-a281-926d355c19af	f
410044cd-6864-4906-ae80-06d3ff41ebc9	5a83a323-4899-4241-a0cd-5f555dec2719	f
410044cd-6864-4906-ae80-06d3ff41ebc9	b45bda6d-0232-4354-909e-6bb095ed6fca	f
5310f114-a195-4a7e-baa7-b097f62d911a	af32fa91-fd8a-4142-9a2f-cd5e04c61f61	t
5310f114-a195-4a7e-baa7-b097f62d911a	f584b95f-51a7-444e-b77f-0dd99e69a55e	t
5310f114-a195-4a7e-baa7-b097f62d911a	9543b9a7-54ab-45bc-b657-8bb53604d2ff	t
5310f114-a195-4a7e-baa7-b097f62d911a	0410aa29-458c-418d-9097-b54e3f68460c	t
5310f114-a195-4a7e-baa7-b097f62d911a	618562ba-a542-447e-8b16-68351e2ee465	t
5310f114-a195-4a7e-baa7-b097f62d911a	7598e7f2-dbae-4657-bd9a-e6e7b80b683a	f
5310f114-a195-4a7e-baa7-b097f62d911a	f9711ac9-2c44-4d0d-a281-926d355c19af	f
5310f114-a195-4a7e-baa7-b097f62d911a	5a83a323-4899-4241-a0cd-5f555dec2719	f
5310f114-a195-4a7e-baa7-b097f62d911a	b45bda6d-0232-4354-909e-6bb095ed6fca	f
846c0b3f-7bdd-4609-be2c-8d894e2ab90b	af32fa91-fd8a-4142-9a2f-cd5e04c61f61	t
846c0b3f-7bdd-4609-be2c-8d894e2ab90b	f584b95f-51a7-444e-b77f-0dd99e69a55e	t
846c0b3f-7bdd-4609-be2c-8d894e2ab90b	9543b9a7-54ab-45bc-b657-8bb53604d2ff	t
846c0b3f-7bdd-4609-be2c-8d894e2ab90b	0410aa29-458c-418d-9097-b54e3f68460c	t
846c0b3f-7bdd-4609-be2c-8d894e2ab90b	618562ba-a542-447e-8b16-68351e2ee465	t
846c0b3f-7bdd-4609-be2c-8d894e2ab90b	7598e7f2-dbae-4657-bd9a-e6e7b80b683a	f
846c0b3f-7bdd-4609-be2c-8d894e2ab90b	f9711ac9-2c44-4d0d-a281-926d355c19af	f
846c0b3f-7bdd-4609-be2c-8d894e2ab90b	5a83a323-4899-4241-a0cd-5f555dec2719	f
846c0b3f-7bdd-4609-be2c-8d894e2ab90b	b45bda6d-0232-4354-909e-6bb095ed6fca	f
dba9cbf4-3729-4037-93bc-3abf30da1779	af32fa91-fd8a-4142-9a2f-cd5e04c61f61	t
dba9cbf4-3729-4037-93bc-3abf30da1779	f584b95f-51a7-444e-b77f-0dd99e69a55e	t
dba9cbf4-3729-4037-93bc-3abf30da1779	9543b9a7-54ab-45bc-b657-8bb53604d2ff	t
dba9cbf4-3729-4037-93bc-3abf30da1779	0410aa29-458c-418d-9097-b54e3f68460c	t
dba9cbf4-3729-4037-93bc-3abf30da1779	618562ba-a542-447e-8b16-68351e2ee465	t
dba9cbf4-3729-4037-93bc-3abf30da1779	7598e7f2-dbae-4657-bd9a-e6e7b80b683a	f
dba9cbf4-3729-4037-93bc-3abf30da1779	f9711ac9-2c44-4d0d-a281-926d355c19af	f
dba9cbf4-3729-4037-93bc-3abf30da1779	5a83a323-4899-4241-a0cd-5f555dec2719	f
dba9cbf4-3729-4037-93bc-3abf30da1779	b45bda6d-0232-4354-909e-6bb095ed6fca	f
7018dd8d-2b35-442e-b684-e295c562db46	af32fa91-fd8a-4142-9a2f-cd5e04c61f61	t
7018dd8d-2b35-442e-b684-e295c562db46	f584b95f-51a7-444e-b77f-0dd99e69a55e	t
7018dd8d-2b35-442e-b684-e295c562db46	9543b9a7-54ab-45bc-b657-8bb53604d2ff	t
7018dd8d-2b35-442e-b684-e295c562db46	0410aa29-458c-418d-9097-b54e3f68460c	t
7018dd8d-2b35-442e-b684-e295c562db46	618562ba-a542-447e-8b16-68351e2ee465	t
7018dd8d-2b35-442e-b684-e295c562db46	7598e7f2-dbae-4657-bd9a-e6e7b80b683a	f
7018dd8d-2b35-442e-b684-e295c562db46	f9711ac9-2c44-4d0d-a281-926d355c19af	f
7018dd8d-2b35-442e-b684-e295c562db46	5a83a323-4899-4241-a0cd-5f555dec2719	f
7018dd8d-2b35-442e-b684-e295c562db46	b45bda6d-0232-4354-909e-6bb095ed6fca	f
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	af32fa91-fd8a-4142-9a2f-cd5e04c61f61	t
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	f584b95f-51a7-444e-b77f-0dd99e69a55e	t
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	9543b9a7-54ab-45bc-b657-8bb53604d2ff	t
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	0410aa29-458c-418d-9097-b54e3f68460c	t
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	618562ba-a542-447e-8b16-68351e2ee465	t
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	7598e7f2-dbae-4657-bd9a-e6e7b80b683a	f
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	f9711ac9-2c44-4d0d-a281-926d355c19af	f
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	5a83a323-4899-4241-a0cd-5f555dec2719	f
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	b45bda6d-0232-4354-909e-6bb095ed6fca	f
2ef8ef9a-6b19-45db-99ba-819589ddda1e	394978fc-531e-498a-b928-48d65b1fa1a9	t
2ef8ef9a-6b19-45db-99ba-819589ddda1e	036b53ee-aa81-48fb-9708-c7a311055ed3	t
2ef8ef9a-6b19-45db-99ba-819589ddda1e	7430d820-79aa-4941-9514-b90fb5bf8bda	t
2ef8ef9a-6b19-45db-99ba-819589ddda1e	198b19b7-eb14-48a2-a93e-777e550efa0f	t
2ef8ef9a-6b19-45db-99ba-819589ddda1e	15c94410-a2f6-4cc8-8a80-21483730906e	t
2ef8ef9a-6b19-45db-99ba-819589ddda1e	99137542-ae7d-41c9-a837-c0f731719a5b	f
2ef8ef9a-6b19-45db-99ba-819589ddda1e	d02d6f13-a231-4baa-abde-d138cb50e380	f
2ef8ef9a-6b19-45db-99ba-819589ddda1e	6f0fb755-373f-4e0a-8266-2901c8064c19	f
2ef8ef9a-6b19-45db-99ba-819589ddda1e	3897407b-0338-4aec-8402-b81918290d6c	f
f95ce717-e6e3-45da-9312-22644eceb667	394978fc-531e-498a-b928-48d65b1fa1a9	t
f95ce717-e6e3-45da-9312-22644eceb667	036b53ee-aa81-48fb-9708-c7a311055ed3	t
f95ce717-e6e3-45da-9312-22644eceb667	7430d820-79aa-4941-9514-b90fb5bf8bda	t
f95ce717-e6e3-45da-9312-22644eceb667	198b19b7-eb14-48a2-a93e-777e550efa0f	t
f95ce717-e6e3-45da-9312-22644eceb667	15c94410-a2f6-4cc8-8a80-21483730906e	t
f95ce717-e6e3-45da-9312-22644eceb667	99137542-ae7d-41c9-a837-c0f731719a5b	f
f95ce717-e6e3-45da-9312-22644eceb667	d02d6f13-a231-4baa-abde-d138cb50e380	f
f95ce717-e6e3-45da-9312-22644eceb667	6f0fb755-373f-4e0a-8266-2901c8064c19	f
f95ce717-e6e3-45da-9312-22644eceb667	3897407b-0338-4aec-8402-b81918290d6c	f
40b2864c-d64d-42a6-8703-38bdf1c379e4	394978fc-531e-498a-b928-48d65b1fa1a9	t
40b2864c-d64d-42a6-8703-38bdf1c379e4	036b53ee-aa81-48fb-9708-c7a311055ed3	t
40b2864c-d64d-42a6-8703-38bdf1c379e4	7430d820-79aa-4941-9514-b90fb5bf8bda	t
40b2864c-d64d-42a6-8703-38bdf1c379e4	198b19b7-eb14-48a2-a93e-777e550efa0f	t
40b2864c-d64d-42a6-8703-38bdf1c379e4	15c94410-a2f6-4cc8-8a80-21483730906e	t
40b2864c-d64d-42a6-8703-38bdf1c379e4	99137542-ae7d-41c9-a837-c0f731719a5b	f
40b2864c-d64d-42a6-8703-38bdf1c379e4	d02d6f13-a231-4baa-abde-d138cb50e380	f
40b2864c-d64d-42a6-8703-38bdf1c379e4	6f0fb755-373f-4e0a-8266-2901c8064c19	f
40b2864c-d64d-42a6-8703-38bdf1c379e4	3897407b-0338-4aec-8402-b81918290d6c	f
4df2fd4c-f1d3-49cd-832a-2981aabcc3be	394978fc-531e-498a-b928-48d65b1fa1a9	t
4df2fd4c-f1d3-49cd-832a-2981aabcc3be	036b53ee-aa81-48fb-9708-c7a311055ed3	t
4df2fd4c-f1d3-49cd-832a-2981aabcc3be	7430d820-79aa-4941-9514-b90fb5bf8bda	t
4df2fd4c-f1d3-49cd-832a-2981aabcc3be	198b19b7-eb14-48a2-a93e-777e550efa0f	t
4df2fd4c-f1d3-49cd-832a-2981aabcc3be	15c94410-a2f6-4cc8-8a80-21483730906e	t
4df2fd4c-f1d3-49cd-832a-2981aabcc3be	99137542-ae7d-41c9-a837-c0f731719a5b	f
4df2fd4c-f1d3-49cd-832a-2981aabcc3be	d02d6f13-a231-4baa-abde-d138cb50e380	f
4df2fd4c-f1d3-49cd-832a-2981aabcc3be	6f0fb755-373f-4e0a-8266-2901c8064c19	f
4df2fd4c-f1d3-49cd-832a-2981aabcc3be	3897407b-0338-4aec-8402-b81918290d6c	f
daaf56e1-3e6d-4255-88a4-04e0d9312666	394978fc-531e-498a-b928-48d65b1fa1a9	t
daaf56e1-3e6d-4255-88a4-04e0d9312666	036b53ee-aa81-48fb-9708-c7a311055ed3	t
daaf56e1-3e6d-4255-88a4-04e0d9312666	7430d820-79aa-4941-9514-b90fb5bf8bda	t
daaf56e1-3e6d-4255-88a4-04e0d9312666	198b19b7-eb14-48a2-a93e-777e550efa0f	t
daaf56e1-3e6d-4255-88a4-04e0d9312666	15c94410-a2f6-4cc8-8a80-21483730906e	t
daaf56e1-3e6d-4255-88a4-04e0d9312666	99137542-ae7d-41c9-a837-c0f731719a5b	f
daaf56e1-3e6d-4255-88a4-04e0d9312666	d02d6f13-a231-4baa-abde-d138cb50e380	f
daaf56e1-3e6d-4255-88a4-04e0d9312666	6f0fb755-373f-4e0a-8266-2901c8064c19	f
daaf56e1-3e6d-4255-88a4-04e0d9312666	3897407b-0338-4aec-8402-b81918290d6c	f
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	394978fc-531e-498a-b928-48d65b1fa1a9	t
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	036b53ee-aa81-48fb-9708-c7a311055ed3	t
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	7430d820-79aa-4941-9514-b90fb5bf8bda	t
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	198b19b7-eb14-48a2-a93e-777e550efa0f	t
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	15c94410-a2f6-4cc8-8a80-21483730906e	t
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	99137542-ae7d-41c9-a837-c0f731719a5b	f
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	d02d6f13-a231-4baa-abde-d138cb50e380	f
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	6f0fb755-373f-4e0a-8266-2901c8064c19	f
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	3897407b-0338-4aec-8402-b81918290d6c	f
28e7349b-8356-490d-8630-bd9aad26f316	394978fc-531e-498a-b928-48d65b1fa1a9	t
28e7349b-8356-490d-8630-bd9aad26f316	036b53ee-aa81-48fb-9708-c7a311055ed3	t
28e7349b-8356-490d-8630-bd9aad26f316	7430d820-79aa-4941-9514-b90fb5bf8bda	t
28e7349b-8356-490d-8630-bd9aad26f316	198b19b7-eb14-48a2-a93e-777e550efa0f	t
28e7349b-8356-490d-8630-bd9aad26f316	15c94410-a2f6-4cc8-8a80-21483730906e	t
28e7349b-8356-490d-8630-bd9aad26f316	99137542-ae7d-41c9-a837-c0f731719a5b	f
28e7349b-8356-490d-8630-bd9aad26f316	d02d6f13-a231-4baa-abde-d138cb50e380	f
28e7349b-8356-490d-8630-bd9aad26f316	6f0fb755-373f-4e0a-8266-2901c8064c19	f
28e7349b-8356-490d-8630-bd9aad26f316	3897407b-0338-4aec-8402-b81918290d6c	f
\.


--
-- Data for Name: client_scope_role_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_scope_role_mapping (scope_id, role_id) FROM stdin;
7598e7f2-dbae-4657-bd9a-e6e7b80b683a	2340003c-fae8-45af-b235-7d4ef11d7597
6f0fb755-373f-4e0a-8266-2901c8064c19	8019af4c-cdfd-4baf-8863-8a845075a731
\.


--
-- Data for Name: client_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session (id, client_id, redirect_uri, state, "timestamp", session_id, auth_method, realm_id, auth_user_id, current_action) FROM stdin;
\.


--
-- Data for Name: client_session_auth_status; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session_auth_status (authenticator, status, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_note; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session_note (name, value, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_prot_mapper; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session_prot_mapper (protocol_mapper_id, client_session) FROM stdin;
\.


--
-- Data for Name: client_session_role; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_session_role (role_id, client_session) FROM stdin;
\.


--
-- Data for Name: client_user_session_note; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.client_user_session_note (name, value, client_session) FROM stdin;
\.


--
-- Data for Name: component; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.component (id, name, parent_id, provider_id, provider_type, realm_id, sub_type) FROM stdin;
29e29699-eaad-4935-b072-1607ae0db619	Trusted Hosts	cb657751-60e1-4583-91be-f6ae0b5826d5	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	cb657751-60e1-4583-91be-f6ae0b5826d5	anonymous
7dcdf7c3-8cda-4b40-9975-b84af230e1c9	Consent Required	cb657751-60e1-4583-91be-f6ae0b5826d5	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	cb657751-60e1-4583-91be-f6ae0b5826d5	anonymous
e45ecced-cc65-4eb2-8ec9-439473c32c87	Full Scope Disabled	cb657751-60e1-4583-91be-f6ae0b5826d5	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	cb657751-60e1-4583-91be-f6ae0b5826d5	anonymous
502d7dbb-a96e-4ce1-a62c-09ff7f4523ee	Max Clients Limit	cb657751-60e1-4583-91be-f6ae0b5826d5	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	cb657751-60e1-4583-91be-f6ae0b5826d5	anonymous
4d32063c-1140-43f3-9176-4ea77d100a54	Allowed Protocol Mapper Types	cb657751-60e1-4583-91be-f6ae0b5826d5	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	cb657751-60e1-4583-91be-f6ae0b5826d5	anonymous
ee2a9f4f-8063-4e39-a588-c58247787499	Allowed Client Scopes	cb657751-60e1-4583-91be-f6ae0b5826d5	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	cb657751-60e1-4583-91be-f6ae0b5826d5	anonymous
7d7c1078-c6ef-4de9-a294-2d449c710611	Allowed Protocol Mapper Types	cb657751-60e1-4583-91be-f6ae0b5826d5	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	cb657751-60e1-4583-91be-f6ae0b5826d5	authenticated
8d2e0341-2d4d-4030-a435-0a885bde4c05	Allowed Client Scopes	cb657751-60e1-4583-91be-f6ae0b5826d5	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	cb657751-60e1-4583-91be-f6ae0b5826d5	authenticated
6f3d8a9f-79e6-4f2b-b6b7-2fdc46a4bd6d	rsa-generated	cb657751-60e1-4583-91be-f6ae0b5826d5	rsa-generated	org.keycloak.keys.KeyProvider	cb657751-60e1-4583-91be-f6ae0b5826d5	\N
2f744c7b-c577-444a-a9d7-34d34d0aff8e	rsa-enc-generated	cb657751-60e1-4583-91be-f6ae0b5826d5	rsa-enc-generated	org.keycloak.keys.KeyProvider	cb657751-60e1-4583-91be-f6ae0b5826d5	\N
20fc85f1-8edf-4353-a3f7-aed19e21d44a	hmac-generated	cb657751-60e1-4583-91be-f6ae0b5826d5	hmac-generated	org.keycloak.keys.KeyProvider	cb657751-60e1-4583-91be-f6ae0b5826d5	\N
42c09914-3534-42ed-ba21-cb5819613f1a	aes-generated	cb657751-60e1-4583-91be-f6ae0b5826d5	aes-generated	org.keycloak.keys.KeyProvider	cb657751-60e1-4583-91be-f6ae0b5826d5	\N
0566d7b9-2a9a-4d72-930a-fc8856a0d1ae	rsa-generated	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	rsa-generated	org.keycloak.keys.KeyProvider	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	\N
eb367651-ea8b-409b-88cf-50a1f31f4a12	rsa-enc-generated	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	rsa-enc-generated	org.keycloak.keys.KeyProvider	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	\N
ca23b83b-8f9c-4b93-bc78-1a163a90f0c0	hmac-generated	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	hmac-generated	org.keycloak.keys.KeyProvider	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	\N
d0cfe34d-b14a-4ed5-8395-5245e15600a4	aes-generated	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	aes-generated	org.keycloak.keys.KeyProvider	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	\N
a4531b97-bab2-4ea7-bf33-bfb57381bf5a	Trusted Hosts	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	trusted-hosts	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	anonymous
5d823c69-fcd7-42e6-a36a-9cc42dfe051e	Consent Required	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	consent-required	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	anonymous
bffd7558-9c30-4727-a4da-442cacf10a57	Full Scope Disabled	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	scope	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	anonymous
7263f4c1-e957-47da-a0b9-ecb701770462	Max Clients Limit	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	max-clients	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	anonymous
525b9d4c-2dca-4a96-bcc9-682d9bbdef26	Allowed Protocol Mapper Types	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	anonymous
c566be95-eaf4-4a64-9e60-3f3fc78ecd8b	Allowed Client Scopes	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	anonymous
0940bd58-6822-462e-9567-3e6ed49b3877	Allowed Protocol Mapper Types	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	allowed-protocol-mappers	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	authenticated
575176be-7eab-457f-993c-5225db1a103a	Allowed Client Scopes	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	allowed-client-templates	org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	authenticated
e50e2428-85bc-43ff-98b9-87b8d37ed993	\N	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	declarative-user-profile	org.keycloak.userprofile.UserProfileProvider	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	\N
\.


--
-- Data for Name: component_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.component_config (id, component_id, name, value) FROM stdin;
f0edcf4a-4414-4cfc-8fda-02efb2672930	4d32063c-1140-43f3-9176-4ea77d100a54	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
209bae4c-b34d-4709-94bd-514dd47137a4	4d32063c-1140-43f3-9176-4ea77d100a54	allowed-protocol-mapper-types	oidc-full-name-mapper
0b94aee0-ab0a-4a2c-ac47-c53c64eb2177	4d32063c-1140-43f3-9176-4ea77d100a54	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
fe5f1bda-d25d-42f7-9b5a-49f7cc17013c	4d32063c-1140-43f3-9176-4ea77d100a54	allowed-protocol-mapper-types	oidc-address-mapper
2c626e48-c25c-4ef8-a874-7a80bef79719	4d32063c-1140-43f3-9176-4ea77d100a54	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
a30c671e-2248-4181-9da2-ede5d09a8d65	4d32063c-1140-43f3-9176-4ea77d100a54	allowed-protocol-mapper-types	saml-role-list-mapper
457538a8-e720-43ea-b8af-95bf9aa0def6	4d32063c-1140-43f3-9176-4ea77d100a54	allowed-protocol-mapper-types	saml-user-attribute-mapper
c651fefa-077e-48e8-bcb9-a3870fb1f00e	4d32063c-1140-43f3-9176-4ea77d100a54	allowed-protocol-mapper-types	saml-user-property-mapper
364bfd9e-78ee-40b2-90e9-b50732029390	502d7dbb-a96e-4ce1-a62c-09ff7f4523ee	max-clients	200
4696dbec-53fa-4332-94e7-d4b489772e78	29e29699-eaad-4935-b072-1607ae0db619	client-uris-must-match	true
95512d89-ce7d-4e56-9fbc-783ac0593268	29e29699-eaad-4935-b072-1607ae0db619	host-sending-registration-request-must-match	true
c6ef7140-aacb-4322-a944-1b14b3ed950f	8d2e0341-2d4d-4030-a435-0a885bde4c05	allow-default-scopes	true
a8429b16-f5f6-4828-b5a4-ee8cd1e9c93b	7d7c1078-c6ef-4de9-a294-2d449c710611	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
afd49bf3-4c8b-463c-8968-43e16e2046b9	7d7c1078-c6ef-4de9-a294-2d449c710611	allowed-protocol-mapper-types	saml-user-property-mapper
60cbf61d-af79-411a-b13c-4ffad3bab698	7d7c1078-c6ef-4de9-a294-2d449c710611	allowed-protocol-mapper-types	oidc-full-name-mapper
30e6812a-5ce9-4f49-8f84-8f34ff4f6299	7d7c1078-c6ef-4de9-a294-2d449c710611	allowed-protocol-mapper-types	saml-user-attribute-mapper
7c8cc12e-04dc-47fb-b3a5-95379755a217	7d7c1078-c6ef-4de9-a294-2d449c710611	allowed-protocol-mapper-types	oidc-address-mapper
ca0669c9-4a77-4f9c-96d9-7bde881f8f1d	7d7c1078-c6ef-4de9-a294-2d449c710611	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
6c1349d6-a365-4abe-8f60-4431dd02a7cc	7d7c1078-c6ef-4de9-a294-2d449c710611	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
b74d89b8-3a84-48c0-a986-fdbb1a1643c2	7d7c1078-c6ef-4de9-a294-2d449c710611	allowed-protocol-mapper-types	saml-role-list-mapper
efcf35f1-e4b3-4f6e-9340-567e7dc141a1	ee2a9f4f-8063-4e39-a588-c58247787499	allow-default-scopes	true
b61333a8-a232-4077-9877-2f2c1a9c0c14	20fc85f1-8edf-4353-a3f7-aed19e21d44a	priority	100
2096abee-d5df-48eb-b7b4-4bcf138d8704	20fc85f1-8edf-4353-a3f7-aed19e21d44a	algorithm	HS256
8dad8560-7368-4898-b402-7df5f169b66c	20fc85f1-8edf-4353-a3f7-aed19e21d44a	kid	2475367d-2831-4434-9362-873c51d0ec47
ecf2d7a6-f146-4d9b-a441-8f58912df36a	20fc85f1-8edf-4353-a3f7-aed19e21d44a	secret	DXqcGAeMg40brWoowNbY3-zrea5KPvOD65lki-_TA8PZVkBmInz-QDn1SuGKxpZa78vNEJou4NG8l2CKMWNsIg
923ce765-aecc-48ba-93b8-0037cf482489	42c09914-3534-42ed-ba21-cb5819613f1a	priority	100
7345d96a-ddeb-4c53-b2f9-2ebbc7099cac	42c09914-3534-42ed-ba21-cb5819613f1a	secret	Ik4Tkv7jEkO5nGyti-KsFw
d6a1aa3f-a521-49f6-af6f-b02e8b95c394	42c09914-3534-42ed-ba21-cb5819613f1a	kid	14a5635d-cf64-4c20-99ca-3dab09915dc5
f3491876-3341-4e41-b239-7a96b497b64d	6f3d8a9f-79e6-4f2b-b6b7-2fdc46a4bd6d	keyUse	SIG
503d8b8c-6095-4a9b-9088-eef6308f639b	6f3d8a9f-79e6-4f2b-b6b7-2fdc46a4bd6d	certificate	MIICmzCCAYMCBgGKXz3MjTANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjMwOTA0MDgwODIwWhcNMzMwOTA0MDgxMDAwWjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCtzvuMiW9dZXL/iMEv+Hjb1C+4JzA/8R5+0U5hV33rLx6wwzOyJeHs09DnBNMgPSBb32k+35zgCViAnASywvIDOJ/+C9e50iIcbteBsXLxBYhi6zlxAUkLX3lGdLgtiyG2h+Cd92VtIWze9rXbvWD97ITYVvDdjv/Z/HCwBGUUO3I2R5qGyNWjETMs4RTIDRFe78PBhqlhbQsaWdnrErTkouX/i3e7qqF7I8Ia4YtqojnwPkR435Mc5jcmTlmanHe9hhCKewFnyiLTgmY4xMxU7hTiSb6fPIvqXB2WmVnKpUttlbVjJJbdHAoMIM/oP8FncByZFlAYM9Bowc92iXmlAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAF5nHc5Eoq+RE98Ssj1uLXG09DVgaEoj41kWa6cHhr/md5wjGj8E1+bRen4ialosjRmUFa5UyeDx0iIFflAdlIEtQab3hHYl8lxiw/BsnpoO4T6heCF9qZsS7N7lOVU4KYHczup5X/8hnnQHPBYDlBlPa3tY28oP4wZvQgfPyxJjZNDw8tMvkSrPD6gtn5GmRi4VBEGJeZF/CcBpPU89ynyeugtDS5rcr9HPg/vqWlKMvbkydJrUiljqyt0LHm3wPY3iZmV0HWaFjkJwnfHxqdHEjaaIzjEZYAY+Ui5oTgV9luWPuCe7NjKEtvoOlc7qqALWljCsju1A7LoMXW6T/yI=
fd19b61a-8f9e-4ff3-8d0e-a0562f397576	6f3d8a9f-79e6-4f2b-b6b7-2fdc46a4bd6d	privateKey	MIIEowIBAAKCAQEArc77jIlvXWVy/4jBL/h429QvuCcwP/EeftFOYVd96y8esMMzsiXh7NPQ5wTTID0gW99pPt+c4AlYgJwEssLyAzif/gvXudIiHG7XgbFy8QWIYus5cQFJC195RnS4LYshtofgnfdlbSFs3va1271g/eyE2Fbw3Y7/2fxwsARlFDtyNkeahsjVoxEzLOEUyA0RXu/DwYapYW0LGlnZ6xK05KLl/4t3u6qheyPCGuGLaqI58D5EeN+THOY3Jk5Zmpx3vYYQinsBZ8oi04JmOMTMVO4U4km+nzyL6lwdlplZyqVLbZW1YySW3RwKDCDP6D/BZ3AcmRZQGDPQaMHPdol5pQIDAQABAoIBABtKLnDoe1XcweuhW0Pe7YsGi9+MN6UyhKlAz9+0zw6IPXdfjtRf4lM/BsPfHA8pydTjBTFcBtOeZAj9djdjKICc+XH4Bg0lEzoHpUq1w+hYCAwQBtrZatCgUvhfBzQPbmGsf/YNjB1QbDmt3uv7likIY+tb60G+XCmr2z2n0v8T/BKrOTLjqZSvCrCNlyavnPERi0HJ7Xck2Kx8V9olEEAO0xqKR7MAl6yfUOMdllWiAgC6fThJxX/CG//gJDM+jx/BXUNeZV05/YX1Os4d3e5pidDQJ2e5xLToIi2D9MzNIwLglOX+j6ChKWA0gq09rLh0N5vOFshKPz/BwYifc0ECgYEA3IBI5xK6LJlESG4Yogs3MIteoSg2raS1nIEaGGj54mUXLr/YVfPKnPfaCOvMCEXslbq4oV2ad/mwEbzfM6glYQnmr8UktihdHg0TYqEyyifr8eODsukjp2Xf8H9t37LgtmE9ovyB4WAz8ILIVJTbwH0MfphvjdTmhltFnUTc2bkCgYEAycpQNNGg++zGz/xszZZN84Sj4q17/LSl7A2BhrukoTX6ZXbLzjTvbOwzccWWWNHOR73+TJwEOmWMIeElaAouL3kL328d2ekdClllsMNKQfUYOSDbooclq2EvuOqiSfV8o2C9+tn8YWssaoHJD1vwqu6lGI24W7RGSPU6fBLmZU0CgYEAwRSIQebxJVp0I2Rcp5BgnF5912pqLrUa3ldiLVvG7EqO+T2+Rs16bubNgqBPgjMQjq/5OjvHpiT62x1i6U3kpUtRODrOAb/oggb7IZN78O7yOVZ7HS/vK4cWh/ZdlNOC19Dgcxbe+CYQdRtgJkhPAQe+6B+9FxoFXkMP+z2wkekCgYAujUTJmp7H34zSCIrVNtqO1ke0kI8s8kPg3BDIk1tccYZth+VmkeG2QBtyIMIZhXVQKa2T4N481pZobndhtA+JliQ+DHVXgybW7169U6A67R8EducUbJctHUOUJlUAOOjjC/tn9of5tW7Ot1g5+dzgoiNmMbOZPFKGnEQ8wWNzdQKBgBJBZdtCNvU+rSjXGgJYUJs3fCYJeKIVAgDUGSFd42cccb7w4MCJRZHBDOkFGG2G7WyrT35/4IExyIr8IIZHd8IpBxW1DoQ39+oYRi7Cb2jPJ5FKlBMWODkPy/2ibDlQBIILVHZ4C+E6KmzeiOLvBGplKdgbqKefzZXznbI1dt0N
e29c7269-eb17-4b2a-87e0-b4411877dd64	6f3d8a9f-79e6-4f2b-b6b7-2fdc46a4bd6d	priority	100
88265163-8835-43fb-8110-2b8d49c7940a	2f744c7b-c577-444a-a9d7-34d34d0aff8e	algorithm	RSA-OAEP
dca207b2-8cf8-4c95-adb6-4be2f37cb471	2f744c7b-c577-444a-a9d7-34d34d0aff8e	keyUse	ENC
0d95b819-5f82-48b5-927c-b9e445ba3c55	2f744c7b-c577-444a-a9d7-34d34d0aff8e	priority	100
840aa6bc-fb6e-4715-8bda-f861181bbbc5	2f744c7b-c577-444a-a9d7-34d34d0aff8e	privateKey	MIIEpAIBAAKCAQEAx34JwOcgANPJxTyCg4ZRN6WCZySoYFtWZ01YagPXvKz5UlLYpQl/RxXXRDH0buIbkG4vQ25WWhszTyzBJrsUpci9q0KRwFmiwSHRAUKaMPKfs5Hv6xgjr1Cg0XN6bT5w5rTs9UinkYsHQDn0MTSu0ZRcNqvGe+jFMPihtZrMtOaiHvrPxX+BYBxpLYHAX9xTIly5kbPCS8UYdUpigwZTzc6Olo6lLrDqzLsSsbYnqfODwuzHu62iQKsZG6e4BxS4xW7wrS/vwC8d9jMirhVlDQlEgfRQtRziyo+DKGNnLEVZ5oIX0eaSSDmD0il8oOHuA8A5YF3A0c7AogtCsLM9wQIDAQABAoIBAFEQV1hK0wdjCF+cmhBmGUS6fcX58G3PT8oEdQQHcbgatemM/rn5pP2201XD0ubn/HlxPMVy5aYR3YSz0/0wElDXxLL+BwoZonhGjI6tiMiRHvIyQELQ+Vc5NVBHU51mvSwSoyN9FZKf4x9nLWJ9XPiPB/WzUaFyUgb3UYbhU4PCZ+Hqhfey+DoDGan98vD3IVspHuiPUbcE9IFamGkbr+pxjgPVrnvP/U/6EjJaBeTH+bWO4R6MVXwmwl18KbcUsUu/W5AcsD5mnMM+w4qEaBtJ3/2p+NDuZyqhKB3QCdhZQE2zSQEYEDEnCm1giE/+5iu2p51X+ZLF2tuG9uam5l0CgYEA+P2ERZw9utg3p1imn+YNJ5cDVBg5ZbEaLy85jzTFLJP0f4Dafzd+mDV1vvX7nhdwmMufBjb4Kb3fiaU4aEKpLGfLq0Dz6eM9jVICmomja2rfp5ntkrCTZVk+a2MX63r2Cdz6ybYP67esvT+sJJGcxUPzE6SxyLYFEC+8zbNCnDcCgYEAzRvJnXij+LhAspgdtMYxPMSM/Oiv2sn02SjZ7bv5hxCeIzhQGq9a6qDQDG5BrC4z1ndew6ENhjHpBNLbe6+iGP9li0ZgaewklqaY630RD9oIW/7C149dJRwa9Ke73FsU4SJX4Mwb2dF9/EtiOqYafHFGjfwLG8Fk34bP+fzRKccCgYEAqmFgl/m4TBkUzFDfhF959PNjdbI15J5yGoOoUZR8sGp2TqGv4ono+OLsNcZBbgcAJ65+nVQUMQwa4SfMF5w2A4rrVb7Wqd+0CPZrjbBNwX2amie86DooQpv1GKrwfVTg9BLhEhKhhl1juQTPGR8DNgGvXmu+tGfJwy/HdMML+7UCgYBmEU7qWw+WBPLFLSeTPxFfgRv7+zsPsHJ04nxYbrOEwANB2ZMbRGoE2lPN68woh7FqJ2r0BSA6yHmB2gA487TBpc59WV8/NrEaevscLNehwMlqJkQFiyU6A1typkm5JWYlhraeelPdt/9u3oCaWPBTPvdyTpukiz/McETszR+1HwKBgQDV73EJHgmkecmat2+eodvSokZuehKXVVUAa61OJJ4mEk2ylof3bxgPdYecRRqtWcHq3IY2oSinK9qvGxupqSJ2+A6xCT8KEMfwr4R5ottQkP/dkmJrK35z80qIeLNnHfschN5QuihBoRq/dv+1V/n7wzbbj9+t5Hxwog0xF8/9Vg==
cf32bb2f-3aa3-4af5-a2a6-d9502280fce5	2f744c7b-c577-444a-a9d7-34d34d0aff8e	certificate	MIICmzCCAYMCBgGKXz3OMDANBgkqhkiG9w0BAQsFADARMQ8wDQYDVQQDDAZtYXN0ZXIwHhcNMjMwOTA0MDgwODIwWhcNMzMwOTA0MDgxMDAwWjARMQ8wDQYDVQQDDAZtYXN0ZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDHfgnA5yAA08nFPIKDhlE3pYJnJKhgW1ZnTVhqA9e8rPlSUtilCX9HFddEMfRu4huQbi9DblZaGzNPLMEmuxSlyL2rQpHAWaLBIdEBQpow8p+zke/rGCOvUKDRc3ptPnDmtOz1SKeRiwdAOfQxNK7RlFw2q8Z76MUw+KG1msy05qIe+s/Ff4FgHGktgcBf3FMiXLmRs8JLxRh1SmKDBlPNzo6WjqUusOrMuxKxtiep84PC7Me7raJAqxkbp7gHFLjFbvCtL+/ALx32MyKuFWUNCUSB9FC1HOLKj4MoY2csRVnmghfR5pJIOYPSKXyg4e4DwDlgXcDRzsCiC0Kwsz3BAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAI+jgOVTKeZrUxpZfO1SIJyA2CxGvg2FSZMY8yfHFWHn6sWeK5DvgtcVpWDmsneBsSVvizKdMEitOE44F02Kljq/In+3v0dPbcgmcGwiG1Jlhr7hQsAGbtVXJkoPo9VsgbvgYB3L0FOlq5RvNxBMlgWlH/MUYybMvM9ceoedV1DheiBNKtC9zp2RSOFp0c3yzVFlfT45HLs6VSX4cougpYimYfGDLt54VOgMaL3cMGY1w8MEiCmxtzASWm4XRB7AdQMxWd+qqkSiSh7jzWI0zlLjFBuiK5zr82A3tH1oUr6Gd+JEpY+Mom8Os8erK0RmMsdxkD6OEpuZWHD4rXDGziU=
d8d59ceb-d556-4455-b3ca-53f315206c13	0566d7b9-2a9a-4d72-930a-fc8856a0d1ae	priority	100
73aaa936-809f-446d-9343-c98254485aef	0566d7b9-2a9a-4d72-930a-fc8856a0d1ae	keyUse	SIG
70b8c12e-0e36-4039-a79b-43d01d2ea82d	0566d7b9-2a9a-4d72-930a-fc8856a0d1ae	certificate	MIICpzCCAY8CBgGKX0i+BjANBgkqhkiG9w0BAQsFADAXMRUwEwYDVQQDDAxtYWluemVsbGlzdGUwHhcNMjMwOTA0MDgyMDE3WhcNMzMwOTA0MDgyMTU3WjAXMRUwEwYDVQQDDAxtYWluemVsbGlzdGUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDHmIQWnLSy1LAHuk0t/6jeYM/3IUJ4EKV+11KVx7FjIA5WD3x0S24toPXXge/VjFWLA4MSv2Gjl3EXg+vEMZAbtFkdv/ShZqMqZRc3FxOJk4ATQekTClWCdmDQc/o+nLHcRnUX0iiivOd7hMQ86Rfb70DCVMBiQ914RrtiBWXcTSuLVnN7EDmBFHLU7UrWp3CbzrM5o2dQj4WoIPz8+Kn5TjlwCsj1VO8axjUDmXJ+Rk6grmkqU2AuTTwH8aU0yA4HEw91WBr897sSmf9KqXHvaxreRY/feWAuo+E/6mkcH9BEGZyIyu7F6eS0lkQDkTC88retK9rr5+qJLl8udC9dAgMBAAEwDQYJKoZIhvcNAQELBQADggEBADfr8/UwqmI4T6FJIONZymHCGv33JJCxnSoPEYT9R+V5cOklroRC+r6QafYq0ovpmcmSqjl41+0z73YWJeoiUwVGsDQ9yupPuMgRJSH91fghHFbs6hePeR+GauMhwSQt9FCcCzpIBACK0MyeUUbT4DvLrpFbFcfRJrlBCzPvbQ9LeQYpxTM5nMUAcqekmiaeqhbuWO9rCxTGHh82tu39GzMk7j2YITSdPcbDkhYByb43CpjsNPUCteQAePpQx04qQ/jJ5PMGNkNi+q+BIurdPj5BIPwtCUh1LdnXmF2tO73zUpStQcvL1C5G2l7BbMK3M5+IwNFQOrobWNc+Ung0BbE=
f02a03ec-2e81-4407-8410-ba85ffe1f986	0566d7b9-2a9a-4d72-930a-fc8856a0d1ae	privateKey	MIIEpAIBAAKCAQEAx5iEFpy0stSwB7pNLf+o3mDP9yFCeBClftdSlcexYyAOVg98dEtuLaD114Hv1YxViwODEr9ho5dxF4PrxDGQG7RZHb/0oWajKmUXNxcTiZOAE0HpEwpVgnZg0HP6Ppyx3EZ1F9Ioorzne4TEPOkX2+9AwlTAYkPdeEa7YgVl3E0ri1ZzexA5gRRy1O1K1qdwm86zOaNnUI+FqCD8/Pip+U45cArI9VTvGsY1A5lyfkZOoK5pKlNgLk08B/GlNMgOBxMPdVga/Pe7Epn/Sqlx72sa3kWP33lgLqPhP+ppHB/QRBmciMruxenktJZEA5EwvPK3rSva6+fqiS5fLnQvXQIDAQABAoIBABS93jglV8ffv11GOIAHuepGIEZ7v9cPT8tzH+NtyZrV+XdrC5FgR1ZZjEK1f5FvEHKuTkA0ADcKZVe+v1D3n5SpdLtZN9hP/LPKppN0g/S/jccyicCPSdyRZbUz4DUCfp83+TIdBlkHDX0yClyUEoUqA05OlWGA0PKPUyi4C+JNOZNMPjeF+EsFm2X0v7Mw/55AXFYMkipdGKXpmBRYJj1uNFnjWJFwDYb2CkJN8bUp03l1SSyOoctrUq/k3qHvnI2fyuBF0sig5gkWDjsgW1KCvaZZ659gVbg5ShqNrEyfuyKOavr/JVyqpONfMk84XgRGLYfElatHBvi3qQ+z2qECgYEA9APVgV4saDw+39MxdLFhes6anQtuTyi8XkCZCqT8eNP+Cf7Ug10YwfvUdzOZ2S8IL1BfaqRlVpl85BEoPCyUENzq8JrhTiY9J4Qzeb3OZROGqocdlQPWxYjq7Lam0gyBFoJdBMcpx5tCzo7L/nyDl72L0XdI8VQmX7mP3rhnFe0CgYEA0WYrR6L7UUdRo8mzp7AVAfPFRVuswDzAhzMfcxHRDi9aARdsWGW1/BqxuBYE5gGB3xA6cmWvjR9EwLdo19U98063xFYpejhNlLQK3iQEP+252C05FXqGilAOiHlCbiv60+huvpuafHtf904jhRf9Xnwr34C9lsVE2aBAhM7NUTECgYEAjFP8H9bBoPwsiFmTEnHEBnT0U6Y0PM/HbEin+oghLXd0m9jx683JJB2n9Rk2u8Cha1xEUzbRlHjWau42/kwApqX1coMPWPsCpkwPsk5meJg/FKh5aa34gEcaGyF7VEaeogw8ZDgJHeJ7DADw7Zw7rTLzSnXX+/kRzHERfNr9ZY0CgYAB2MbU8OkKhHiB20uMVQ86Xy4EOJTDdUW1a4wBdczENUKz88Lu3KbIPGwI1Zjhdm3wy7HYRHFR606t7HAuRyEuvij8wE3JWCnG//eAkgy/i5cyAuQX/malXaNjLL6bPiQOLmSbpb+tDWGBSt0hVV7UsH+qjvYdGExNJw6qnTBOYQKBgQDrzH4VY6SIBpTJ1fM+Z7jIB8KPCR6wtX71c6Qn8FhM9/e+BcMgqNNHXXrgmWp0kFI78NJ4CKaI/1tebhpKAWiZ2F1D+a8+sili9WoB1n5Lf8lGkItmDBDAAnPEyitiGPxjC67ddx4aQhA9YC9+fPKYno5BpiDNGFThR9FkSiuzIg==
0553baa7-cd7e-4b8b-a7bc-5e9fc79d687a	ca23b83b-8f9c-4b93-bc78-1a163a90f0c0	secret	a2T7oUWkfd1AgIiqlzd87_VZfmiPWsXuRI_95b9kbqab1AtJW6hnvSJ3yf6-CsKITv1vWumZ5ef0zVr8csHUUg
395cacd5-22a5-4bac-9de9-c57375be0388	ca23b83b-8f9c-4b93-bc78-1a163a90f0c0	priority	100
7baf17ae-4e8c-48a2-8f76-00c9369b0945	ca23b83b-8f9c-4b93-bc78-1a163a90f0c0	algorithm	HS256
d059ab68-8450-46b8-8b11-ddf6b95836b6	ca23b83b-8f9c-4b93-bc78-1a163a90f0c0	kid	13a04e27-f705-431f-943d-08f17529a015
94f8138c-0538-4162-ba95-afa8e2b92f45	eb367651-ea8b-409b-88cf-50a1f31f4a12	certificate	MIICpzCCAY8CBgGKX0i/EjANBgkqhkiG9w0BAQsFADAXMRUwEwYDVQQDDAxtYWluemVsbGlzdGUwHhcNMjMwOTA0MDgyMDE3WhcNMzMwOTA0MDgyMTU3WjAXMRUwEwYDVQQDDAxtYWluemVsbGlzdGUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCifPk+PLFmnCijLaHyUJhF7WYSthkusWym09zyJZ9knBxMS8tKJj1kb5w+io2JnnWkW7Eh3mURmmfiwctj155CcoBebtE4PeGP0Y3bpMjC3qCsBBkYCjhhRa3taEfJZgcfo8sIBmHOrEE191Nn99kD1a8lkPjBZVwGAoBpnUTuST0YykuDDHnnpTwiuCc0F/U8Qu0XQDX4/AugpuYdsxsTx7FiU7AQKm8dUnotx7JIOwoyZBCdFVV7k8YWDKE8msq/nADoJHXOej3tspu9uVS+Xt/VcbSQTk4VgIfs1KfTA28H+VF5NpWYJJpK9n7/fRoGTtJWyyAh0QxIw+8v4lftAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAFxYEuAWzQyxwnQP85iZE/EbTzL3wzRDXq7P6hV8sRDFZ99jnivtZR8mOnBNjdDzfjUJSPr+modSXLoDrExCl7fgdWeriqmrXMTnB4ikAT6JzL/YCRZ/nu3Cq/fNBeTukLHTyg2odwd9GwsEXGQ1amtEQtEznXCTqK5FJdr4Z59LjZqYUjR9kgD14VobKr7KdUlg0X31ikzBQHUKs1MX4Irpta5SHg6t4/3ylE9O/WYTAKER2zOsfoTCXchb/piOQx4NFiYcDt0SAI2+Tnb+2gaEBugWop7TM1pQyJOP0BYnfrEVq+lEN01rqDpWKd/eyky1nPksSniymPrwT5Ecf8Y=
37d93dc8-d81c-4d60-b084-93ea455329d4	eb367651-ea8b-409b-88cf-50a1f31f4a12	keyUse	ENC
66d8f5dd-1f72-49f6-9b79-47ba3129e866	eb367651-ea8b-409b-88cf-50a1f31f4a12	algorithm	RSA-OAEP
7d477a19-1e78-494c-85b2-dcf74736fa85	eb367651-ea8b-409b-88cf-50a1f31f4a12	priority	100
a533a855-2a59-4663-9187-cbd669e38d84	eb367651-ea8b-409b-88cf-50a1f31f4a12	privateKey	MIIEowIBAAKCAQEAonz5PjyxZpwooy2h8lCYRe1mErYZLrFsptPc8iWfZJwcTEvLSiY9ZG+cPoqNiZ51pFuxId5lEZpn4sHLY9eeQnKAXm7ROD3hj9GN26TIwt6grAQZGAo4YUWt7WhHyWYHH6PLCAZhzqxBNfdTZ/fZA9WvJZD4wWVcBgKAaZ1E7kk9GMpLgwx556U8IrgnNBf1PELtF0A1+PwLoKbmHbMbE8exYlOwECpvHVJ6LceySDsKMmQQnRVVe5PGFgyhPJrKv5wA6CR1zno97bKbvblUvl7f1XG0kE5OFYCH7NSn0wNvB/lReTaVmCSaSvZ+/30aBk7SVssgIdEMSMPvL+JX7QIDAQABAoIBAE1c2UKTnRcwtHx0xo1baBSrIhU4lCbSHNwVNTYpSYmadjKxR5oHOOWv6iEw0JC8XGCjs2Nfwpkt/dZN1Ku1xkj2wT2033I6rEFQUY1JGLkHTFJ6JQR4IT3W8id9pegy5qNe1dT9TOYcx3ONTS3MKIwV2i01p+pUewr1d/RRB7e3bsdo5HHy939GFfoFZNFrIa4EbEfMheG+DmEw/CUHbomRj0ylTypjalyrcU658rIitHjRK6ILeWjxpVG8DJIlW1oVGxtSQdKv4Bo4Jt4GiYByM+IYznG3/TQdiKUyVCp0BXSl8vn3aY2I/uiUAm1b8dtW/Ff0BTf1NePEQ+8cBNUCgYEA0v6MZe4MDOgbpiQkZfuwQXV4mad1HXCvDbsNSr/JLLK3gdo+BZ5E91HjQ4u8UZD7kreqGQbv1NS5yu4DYh7LH7anS/McYohwQIRvaGG0xee8fFzKwxERuuyTOJWnh9V1GK22POrhcTBBEFA33mx/Qxncks1SvwAN+nCUpmE5bW8CgYEAxSW47AxhLyCWg470P1B6HsShunkhqZU9T/JKBaVPudjFnhVXijy2CFJU72KXCWvDw9EFybbbN3tmniHppBPTvdgLytWp0pln4c+eJR+bHqLRcimuALppNQOj8t0J2f4pXgSlfHkMHoxgkckJBBTjR8OGOnWBjwTYrEh8A4sMWmMCgYAaX7ctBpR7CIhsPBhQpyVhCU4J5uS8yVkYXklLDq4W6EAH+z/FdAMq5xGBX/YqO/U2Yb7hYfyYnf6bXyUNHsxFKo++7qSdrHBboDJM2em+0zi8Ut0FhRyyQOAmMo6+a/A3JX+iHboQa/e2ElDpfKZrvM/VidTOCzO0Gl56bazAAQKBgQCfeQ0l/Dmc2pqGHtwaXyn5u4srgRKmz+8BvXb9LCTaq6vnXVIro0KIZrkHz1NnroFz45/v9HdNYQe4QKxzKgqs1ZdsYvt1PNxYQA6n7vIWjRQpaeez9RZnaON08DIo4TxrLg0DLBOOnnT7WIhvgcn74gCxRx4fJ4dxjUyrvQ2oCwKBgC6Uq+nzrfeV6RWP3dDvgJIoBUwZey6xW8eJ20WLi8qyZfJTBux05MFTnP62EUb+iNyO2TcnHryXM3EMWO0zrr8E9RCHIUV8tS3wWSY+/fcEEALceIBV+J5y1hb83uFTOrYi7NB2flOLbXYrMnSpjd4U4iwAdGC6wBJx3GSF+2jx
17162597-d779-464f-be08-f2fdb9371d34	d0cfe34d-b14a-4ed5-8395-5245e15600a4	kid	e7e6d24a-98f5-47be-b3bf-243157e54064
4d33f502-4072-421c-b9c0-6f534c47ec67	d0cfe34d-b14a-4ed5-8395-5245e15600a4	secret	K6KUcDx5cIfue14p9W3JBA
075919d1-2ab7-4c2d-94d9-a7e0e0de27e8	d0cfe34d-b14a-4ed5-8395-5245e15600a4	priority	100
f891ca6a-0a12-4249-bf57-e48fcfc82515	575176be-7eab-457f-993c-5225db1a103a	allow-default-scopes	true
c7d830fe-dccc-40cc-a27f-14c3cb3861ba	c566be95-eaf4-4a64-9e60-3f3fc78ecd8b	allow-default-scopes	true
2cfdb436-4063-444b-a35e-7b9151f4ff0c	0940bd58-6822-462e-9567-3e6ed49b3877	allowed-protocol-mapper-types	saml-role-list-mapper
92b7d08f-3eca-420a-aefc-82d5dfef099e	0940bd58-6822-462e-9567-3e6ed49b3877	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
c4c42758-69c0-4bb1-bc08-8b0dabdae038	0940bd58-6822-462e-9567-3e6ed49b3877	allowed-protocol-mapper-types	saml-user-property-mapper
0aa1212e-a3da-4e60-8ae6-e7fdcfeb48f3	0940bd58-6822-462e-9567-3e6ed49b3877	allowed-protocol-mapper-types	oidc-full-name-mapper
f554c45e-3342-4add-b6f0-a709afa3fa5d	0940bd58-6822-462e-9567-3e6ed49b3877	allowed-protocol-mapper-types	oidc-address-mapper
3d9454ef-09ba-45e4-b7ef-1d7820669361	0940bd58-6822-462e-9567-3e6ed49b3877	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
0b460627-d48c-4d63-b470-abe7f635da0e	0940bd58-6822-462e-9567-3e6ed49b3877	allowed-protocol-mapper-types	saml-user-attribute-mapper
15c7604b-0f74-47c5-b9e0-4a59e93f7bca	0940bd58-6822-462e-9567-3e6ed49b3877	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
ceef722f-88b8-44cc-8749-62085e4728cc	7263f4c1-e957-47da-a0b9-ecb701770462	max-clients	200
3ca25dfa-5957-4cda-8f3b-ef1e49a426a4	a4531b97-bab2-4ea7-bf33-bfb57381bf5a	host-sending-registration-request-must-match	true
f36c6b84-f5aa-4137-af8d-c227ff0dab86	a4531b97-bab2-4ea7-bf33-bfb57381bf5a	client-uris-must-match	true
51735461-4eb3-42e5-8f34-038934d7156b	525b9d4c-2dca-4a96-bcc9-682d9bbdef26	allowed-protocol-mapper-types	oidc-full-name-mapper
60c1892c-d653-4898-9046-02ad4b20ffcc	525b9d4c-2dca-4a96-bcc9-682d9bbdef26	allowed-protocol-mapper-types	saml-role-list-mapper
4705b6ea-82b1-420b-bae4-3b849016e8fd	525b9d4c-2dca-4a96-bcc9-682d9bbdef26	allowed-protocol-mapper-types	oidc-usermodel-attribute-mapper
59c70f15-7e38-4d38-b4f9-9bbf21a24bc6	525b9d4c-2dca-4a96-bcc9-682d9bbdef26	allowed-protocol-mapper-types	saml-user-attribute-mapper
72dbf17d-a93a-4c48-889c-5a17e5766362	525b9d4c-2dca-4a96-bcc9-682d9bbdef26	allowed-protocol-mapper-types	oidc-usermodel-property-mapper
2bac7c2b-7313-4c2e-9c2f-b07019adb15f	525b9d4c-2dca-4a96-bcc9-682d9bbdef26	allowed-protocol-mapper-types	oidc-sha256-pairwise-sub-mapper
539f17dd-5d70-4fd3-919f-0392204ef2d1	525b9d4c-2dca-4a96-bcc9-682d9bbdef26	allowed-protocol-mapper-types	saml-user-property-mapper
8f6d4590-911b-4ff5-8a19-a155ff12a38b	525b9d4c-2dca-4a96-bcc9-682d9bbdef26	allowed-protocol-mapper-types	oidc-address-mapper
\.


--
-- Data for Name: composite_role; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.composite_role (composite, child_role) FROM stdin;
e305431f-179a-4ca2-8858-355f4f89e86a	9162c0e7-a951-46e2-b8c6-a36cf313be95
e305431f-179a-4ca2-8858-355f4f89e86a	9f4cff83-b092-403a-aee6-091d088c18af
e305431f-179a-4ca2-8858-355f4f89e86a	8c62ab45-2c76-4de0-8297-28a5b9be603f
e305431f-179a-4ca2-8858-355f4f89e86a	9f0bd0bc-5014-4106-87b5-6e03db00a39a
e305431f-179a-4ca2-8858-355f4f89e86a	8bf281e7-9ed9-4aed-bcc2-2a5b0a25fe71
e305431f-179a-4ca2-8858-355f4f89e86a	edd30e2d-aa11-4b31-9dc6-c868b29e404b
e305431f-179a-4ca2-8858-355f4f89e86a	74e2b783-d915-446e-94a7-25cb04790b31
e305431f-179a-4ca2-8858-355f4f89e86a	c45d1eff-dc04-4c15-9b2f-3de4a9f8deb7
e305431f-179a-4ca2-8858-355f4f89e86a	2f164030-2c49-4ac5-9ba1-f5e5e0636f72
e305431f-179a-4ca2-8858-355f4f89e86a	5ea77375-ee0d-4d26-a3d5-86a9046a32fc
e305431f-179a-4ca2-8858-355f4f89e86a	621b521a-c623-48ea-bbba-7bb44760f611
e305431f-179a-4ca2-8858-355f4f89e86a	211dba82-41a0-4ec3-b365-e2c1357e6a18
e305431f-179a-4ca2-8858-355f4f89e86a	8d880db8-49b0-4ba2-952d-3b367d0420ad
e305431f-179a-4ca2-8858-355f4f89e86a	598baf6d-81f1-4db3-8d12-ef23e001acb1
e305431f-179a-4ca2-8858-355f4f89e86a	b6225d93-814f-4716-a4b0-f57d2c9e0c69
e305431f-179a-4ca2-8858-355f4f89e86a	97537824-5edd-415a-988b-4a35b6c685dc
e305431f-179a-4ca2-8858-355f4f89e86a	3042a3f2-5901-4b9b-8b44-41cb76e9c8ed
e305431f-179a-4ca2-8858-355f4f89e86a	ed31fe68-75ff-49f1-82eb-306b7e823139
49b640bc-5d04-4fe2-9972-ebb298f894ab	8231c469-c362-41ca-9041-8db2bf13d606
8bf281e7-9ed9-4aed-bcc2-2a5b0a25fe71	97537824-5edd-415a-988b-4a35b6c685dc
9f0bd0bc-5014-4106-87b5-6e03db00a39a	ed31fe68-75ff-49f1-82eb-306b7e823139
9f0bd0bc-5014-4106-87b5-6e03db00a39a	b6225d93-814f-4716-a4b0-f57d2c9e0c69
49b640bc-5d04-4fe2-9972-ebb298f894ab	1bfd72c8-c9a2-4140-9375-e8116ec5aff5
1bfd72c8-c9a2-4140-9375-e8116ec5aff5	992750de-4bc3-4849-bc72-2896cb2cd84a
bd6eb46f-7da7-4aa8-bb8e-a0abffab2a9c	a30330a9-fd41-4152-a4c3-7506b57622d2
e305431f-179a-4ca2-8858-355f4f89e86a	8ed04683-05ce-4721-b756-3bab28142cb3
49b640bc-5d04-4fe2-9972-ebb298f894ab	2340003c-fae8-45af-b235-7d4ef11d7597
49b640bc-5d04-4fe2-9972-ebb298f894ab	d4e5d55d-b42d-4e57-8996-fb7592593e74
e305431f-179a-4ca2-8858-355f4f89e86a	80f2d71a-c475-4b60-a74e-3358617f5a32
e305431f-179a-4ca2-8858-355f4f89e86a	2c205fd0-6c2a-4af6-8319-1e6e4c2a6663
e305431f-179a-4ca2-8858-355f4f89e86a	2fe923ae-1a93-4e0e-b2f2-75451bd42a40
e305431f-179a-4ca2-8858-355f4f89e86a	3d589bcb-a28b-4ed3-a45a-614bdeebbacb
e305431f-179a-4ca2-8858-355f4f89e86a	4bf72a4a-c55e-4886-9d5b-935c51195eb8
e305431f-179a-4ca2-8858-355f4f89e86a	8268ac48-1291-47fc-9310-9b81a8e42469
e305431f-179a-4ca2-8858-355f4f89e86a	024392d4-f3df-465f-9b88-51002ad68b79
e305431f-179a-4ca2-8858-355f4f89e86a	6761f446-c29a-4cbf-a5bc-dc823ee871c7
e305431f-179a-4ca2-8858-355f4f89e86a	4b481a36-9ccb-4010-9a6d-0466eb2e79e7
e305431f-179a-4ca2-8858-355f4f89e86a	d2c781c6-1e92-4e3c-8228-4fbd20682359
e305431f-179a-4ca2-8858-355f4f89e86a	c7aae22b-ca4d-4cc1-863f-f99f1a6e349f
e305431f-179a-4ca2-8858-355f4f89e86a	2abe175c-a0d5-4053-96ba-7585920c7826
e305431f-179a-4ca2-8858-355f4f89e86a	928138a7-88f2-4a3c-8054-457b6218cca8
e305431f-179a-4ca2-8858-355f4f89e86a	fa41f7d0-b648-4d88-8c14-0509d6c6e4c6
e305431f-179a-4ca2-8858-355f4f89e86a	cf3b97f8-945a-44af-aec6-2d7358c3389a
e305431f-179a-4ca2-8858-355f4f89e86a	8a20342a-92c0-4239-ac0c-c11cfa69382d
e305431f-179a-4ca2-8858-355f4f89e86a	00534edc-21fc-499d-985f-d8eae61426b3
2fe923ae-1a93-4e0e-b2f2-75451bd42a40	fa41f7d0-b648-4d88-8c14-0509d6c6e4c6
2fe923ae-1a93-4e0e-b2f2-75451bd42a40	00534edc-21fc-499d-985f-d8eae61426b3
3d589bcb-a28b-4ed3-a45a-614bdeebbacb	cf3b97f8-945a-44af-aec6-2d7358c3389a
890d2393-69fb-4b5a-bd92-dc134b881a5b	cfac2d4c-ab5f-44b6-81b5-d7bc6cd4152f
890d2393-69fb-4b5a-bd92-dc134b881a5b	1becb55c-604c-445c-9d48-74c1612ae27e
890d2393-69fb-4b5a-bd92-dc134b881a5b	c37c00c7-a90c-40c4-9271-70d6bc96f2b6
890d2393-69fb-4b5a-bd92-dc134b881a5b	e7115a2b-e51f-4e7b-9d14-763772421a3b
890d2393-69fb-4b5a-bd92-dc134b881a5b	d32a4c3d-2b5e-477d-9ac6-c6458d127e1d
890d2393-69fb-4b5a-bd92-dc134b881a5b	464797e0-8d1b-47fe-8d4a-6e01f6c87db7
890d2393-69fb-4b5a-bd92-dc134b881a5b	90885c03-1e3b-4d4a-b82f-61bdb4b5f8b8
890d2393-69fb-4b5a-bd92-dc134b881a5b	7511f9dd-d700-4927-9fe2-114c2a63b589
890d2393-69fb-4b5a-bd92-dc134b881a5b	4b86f5d0-4bd4-4b8d-8e8b-66dd56178366
890d2393-69fb-4b5a-bd92-dc134b881a5b	f8d8ecf7-63fd-4769-98ec-37c6de7e0ee4
890d2393-69fb-4b5a-bd92-dc134b881a5b	533b2fe3-ca4a-4240-bddb-fe7653d22d54
890d2393-69fb-4b5a-bd92-dc134b881a5b	2eb465ec-8dfa-4acb-b5fd-f2eb5e678257
890d2393-69fb-4b5a-bd92-dc134b881a5b	c5c70a09-4718-46cb-9b38-76822f0df547
890d2393-69fb-4b5a-bd92-dc134b881a5b	39c55d12-68cb-4fbe-bb5e-a6aef3211d0f
890d2393-69fb-4b5a-bd92-dc134b881a5b	ca842fc8-f28d-438a-99a1-64a13f362e2d
890d2393-69fb-4b5a-bd92-dc134b881a5b	88d73c8a-fbe2-429e-b960-d804007fd02f
890d2393-69fb-4b5a-bd92-dc134b881a5b	c9c09956-062f-4577-972e-41718e0f4ac1
3c5557bf-bc46-435b-b45f-3e0a6e983f6c	d4247d8c-5ce2-45a5-b8a9-56915d4074a6
c37c00c7-a90c-40c4-9271-70d6bc96f2b6	c9c09956-062f-4577-972e-41718e0f4ac1
c37c00c7-a90c-40c4-9271-70d6bc96f2b6	39c55d12-68cb-4fbe-bb5e-a6aef3211d0f
e7115a2b-e51f-4e7b-9d14-763772421a3b	ca842fc8-f28d-438a-99a1-64a13f362e2d
3c5557bf-bc46-435b-b45f-3e0a6e983f6c	3abd0b3d-00dc-49e7-8f10-bb245a49616a
3abd0b3d-00dc-49e7-8f10-bb245a49616a	44af8192-ddb8-4f2c-8f8c-44a97a74d0e1
8550cc0a-aa89-498a-bbfc-811e3a465492	b2a760bc-c9d2-4f2c-b279-d45a58b9c923
e305431f-179a-4ca2-8858-355f4f89e86a	9b7b14c1-963a-40fb-8e48-a0c3b3c8e145
890d2393-69fb-4b5a-bd92-dc134b881a5b	38445683-b3d0-410d-9830-71365349f29a
3c5557bf-bc46-435b-b45f-3e0a6e983f6c	8019af4c-cdfd-4baf-8863-8a845075a731
3c5557bf-bc46-435b-b45f-3e0a6e983f6c	48aa0ed1-8b33-4c17-ba50-3eee67fd42a3
\.


--
-- Data for Name: credential; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.credential (id, salt, type, user_id, created_date, user_label, secret_data, credential_data, priority) FROM stdin;
8eaa8319-92d8-4907-9c4f-4960d84919c6	\N	password	7bda9e08-19dd-4e32-9785-619fd68cab05	1693815001275	\N	{"value":"ofaVyAYb1ojRMc6f0BcjV9ITszPHQhTUl8g2soccsy+0MUAP1RTzx3ALADQ869spmClIHNj+9LMP+lRU6fQvLw==","salt":"gHcHfUZMSgCyKWtmxQgXyg==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
11fa50f4-bd66-4bda-9361-ae3ce2b2048c	\N	password	7d6df4ce-cfdd-4b44-a653-628e6f4cd042	1693815872937	My password	{"value":"0DfIFCozFin5pUcdkgJCY5VyZT1Fgyo+zysb683JPkEhUp3fdsfiWZ+t+FefQZ5/C3cd64S4sZGUV+bzdoXNVA==","salt":"M/eqlDv3RYSj4RX+LXGydA==","additionalParameters":{}}	{"hashIterations":27500,"algorithm":"pbkdf2-sha256","additionalParameters":{}}	10
\.


--
-- Data for Name: databasechangelog; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/jpa-changelog-1.0.0.Final.xml	2023-09-04 08:09:56.388854	1	EXECUTED	8:bda77d94bf90182a1e30c24f1c155ec7	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.8.0	\N	\N	3814995661
1.0.0.Final-KEYCLOAK-5461	sthorger@redhat.com	META-INF/db2-jpa-changelog-1.0.0.Final.xml	2023-09-04 08:09:56.410554	2	MARK_RAN	8:1ecb330f30986693d1cba9ab579fa219	createTable tableName=APPLICATION_DEFAULT_ROLES; createTable tableName=CLIENT; createTable tableName=CLIENT_SESSION; createTable tableName=CLIENT_SESSION_ROLE; createTable tableName=COMPOSITE_ROLE; createTable tableName=CREDENTIAL; createTable tab...		\N	4.8.0	\N	\N	3814995661
1.1.0.Beta1	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Beta1.xml	2023-09-04 08:09:56.47611	3	EXECUTED	8:cb7ace19bc6d959f305605d255d4c843	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=CLIENT_ATTRIBUTES; createTable tableName=CLIENT_SESSION_NOTE; createTable tableName=APP_NODE_REGISTRATIONS; addColumn table...		\N	4.8.0	\N	\N	3814995661
1.1.0.Final	sthorger@redhat.com	META-INF/jpa-changelog-1.1.0.Final.xml	2023-09-04 08:09:56.48086	4	EXECUTED	8:80230013e961310e6872e871be424a63	renameColumn newColumnName=EVENT_TIME, oldColumnName=TIME, tableName=EVENT_ENTITY		\N	4.8.0	\N	\N	3814995661
1.2.0.Beta1	psilva@redhat.com	META-INF/jpa-changelog-1.2.0.Beta1.xml	2023-09-04 08:09:56.643775	5	EXECUTED	8:67f4c20929126adc0c8e9bf48279d244	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.8.0	\N	\N	3814995661
1.2.0.Beta1	psilva@redhat.com	META-INF/db2-jpa-changelog-1.2.0.Beta1.xml	2023-09-04 08:09:56.646695	6	MARK_RAN	8:7311018b0b8179ce14628ab412bb6783	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION; createTable tableName=PROTOCOL_MAPPER; createTable tableName=PROTOCOL_MAPPER_CONFIG; createTable tableName=...		\N	4.8.0	\N	\N	3814995661
1.2.0.RC1	bburke@redhat.com	META-INF/jpa-changelog-1.2.0.CR1.xml	2023-09-04 08:09:56.766947	7	EXECUTED	8:037ba1216c3640f8785ee6b8e7c8e3c1	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.8.0	\N	\N	3814995661
1.2.0.RC1	bburke@redhat.com	META-INF/db2-jpa-changelog-1.2.0.CR1.xml	2023-09-04 08:09:56.769509	8	MARK_RAN	8:7fe6ffe4af4df289b3157de32c624263	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=MIGRATION_MODEL; createTable tableName=IDENTITY_P...		\N	4.8.0	\N	\N	3814995661
1.2.0.Final	keycloak	META-INF/jpa-changelog-1.2.0.Final.xml	2023-09-04 08:09:56.773468	9	EXECUTED	8:9c136bc3187083a98745c7d03bc8a303	update tableName=CLIENT; update tableName=CLIENT; update tableName=CLIENT		\N	4.8.0	\N	\N	3814995661
1.3.0	bburke@redhat.com	META-INF/jpa-changelog-1.3.0.xml	2023-09-04 08:09:56.905114	10	EXECUTED	8:b5f09474dca81fb56a97cf5b6553d331	delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete tableName=USER_SESSION; createTable tableName=ADMI...		\N	4.8.0	\N	\N	3814995661
1.4.0	bburke@redhat.com	META-INF/jpa-changelog-1.4.0.xml	2023-09-04 08:09:56.970873	11	EXECUTED	8:ca924f31bd2a3b219fdcfe78c82dacf4	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.8.0	\N	\N	3814995661
1.4.0	bburke@redhat.com	META-INF/db2-jpa-changelog-1.4.0.xml	2023-09-04 08:09:56.97322	12	MARK_RAN	8:8acad7483e106416bcfa6f3b824a16cd	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.8.0	\N	\N	3814995661
1.5.0	bburke@redhat.com	META-INF/jpa-changelog-1.5.0.xml	2023-09-04 08:09:56.994949	13	EXECUTED	8:9b1266d17f4f87c78226f5055408fd5e	delete tableName=CLIENT_SESSION_AUTH_STATUS; delete tableName=CLIENT_SESSION_ROLE; delete tableName=CLIENT_SESSION_PROT_MAPPER; delete tableName=CLIENT_SESSION_NOTE; delete tableName=CLIENT_SESSION; delete tableName=USER_SESSION_NOTE; delete table...		\N	4.8.0	\N	\N	3814995661
1.6.1_from15	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2023-09-04 08:09:57.025869	14	EXECUTED	8:d80ec4ab6dbfe573550ff72396c7e910	addColumn tableName=REALM; addColumn tableName=KEYCLOAK_ROLE; addColumn tableName=CLIENT; createTable tableName=OFFLINE_USER_SESSION; createTable tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_US_SES_PK2, tableName=...		\N	4.8.0	\N	\N	3814995661
1.6.1_from16-pre	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2023-09-04 08:09:57.027788	15	MARK_RAN	8:d86eb172171e7c20b9c849b584d147b2	delete tableName=OFFLINE_CLIENT_SESSION; delete tableName=OFFLINE_USER_SESSION		\N	4.8.0	\N	\N	3814995661
1.6.1_from16	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2023-09-04 08:09:57.029756	16	MARK_RAN	8:5735f46f0fa60689deb0ecdc2a0dea22	dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_US_SES_PK, tableName=OFFLINE_USER_SESSION; dropPrimaryKey constraintName=CONSTRAINT_OFFLINE_CL_SES_PK, tableName=OFFLINE_CLIENT_SESSION; addColumn tableName=OFFLINE_USER_SESSION; update tableName=OF...		\N	4.8.0	\N	\N	3814995661
1.6.1	mposolda@redhat.com	META-INF/jpa-changelog-1.6.1.xml	2023-09-04 08:09:57.031503	17	EXECUTED	8:d41d8cd98f00b204e9800998ecf8427e	empty		\N	4.8.0	\N	\N	3814995661
1.7.0	bburke@redhat.com	META-INF/jpa-changelog-1.7.0.xml	2023-09-04 08:09:57.102031	18	EXECUTED	8:5c1a8fd2014ac7fc43b90a700f117b23	createTable tableName=KEYCLOAK_GROUP; createTable tableName=GROUP_ROLE_MAPPING; createTable tableName=GROUP_ATTRIBUTE; createTable tableName=USER_GROUP_MEMBERSHIP; createTable tableName=REALM_DEFAULT_GROUPS; addColumn tableName=IDENTITY_PROVIDER; ...		\N	4.8.0	\N	\N	3814995661
1.8.0	mposolda@redhat.com	META-INF/jpa-changelog-1.8.0.xml	2023-09-04 08:09:57.173973	19	EXECUTED	8:1f6c2c2dfc362aff4ed75b3f0ef6b331	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.8.0	\N	\N	3814995661
1.8.0-2	keycloak	META-INF/jpa-changelog-1.8.0.xml	2023-09-04 08:09:57.178371	20	EXECUTED	8:dee9246280915712591f83a127665107	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.8.0	\N	\N	3814995661
authz-3.4.0.CR1-resource-server-pk-change-part1	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2023-09-04 08:09:57.833623	45	EXECUTED	8:a164ae073c56ffdbc98a615493609a52	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_RESOURCE; addColumn tableName=RESOURCE_SERVER_SCOPE		\N	4.8.0	\N	\N	3814995661
1.8.0	mposolda@redhat.com	META-INF/db2-jpa-changelog-1.8.0.xml	2023-09-04 08:09:57.180278	21	MARK_RAN	8:9eb2ee1fa8ad1c5e426421a6f8fdfa6a	addColumn tableName=IDENTITY_PROVIDER; createTable tableName=CLIENT_TEMPLATE; createTable tableName=CLIENT_TEMPLATE_ATTRIBUTES; createTable tableName=TEMPLATE_SCOPE_MAPPING; dropNotNullConstraint columnName=CLIENT_ID, tableName=PROTOCOL_MAPPER; ad...		\N	4.8.0	\N	\N	3814995661
1.8.0-2	keycloak	META-INF/db2-jpa-changelog-1.8.0.xml	2023-09-04 08:09:57.182182	22	MARK_RAN	8:dee9246280915712591f83a127665107	dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; update tableName=CREDENTIAL		\N	4.8.0	\N	\N	3814995661
1.9.0	mposolda@redhat.com	META-INF/jpa-changelog-1.9.0.xml	2023-09-04 08:09:57.211553	23	EXECUTED	8:d9fa18ffa355320395b86270680dd4fe	update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=REALM; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=REALM; update tableName=REALM; customChange; dr...		\N	4.8.0	\N	\N	3814995661
1.9.1	keycloak	META-INF/jpa-changelog-1.9.1.xml	2023-09-04 08:09:57.216494	24	EXECUTED	8:90cff506fedb06141ffc1c71c4a1214c	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=PUBLIC_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.8.0	\N	\N	3814995661
1.9.1	keycloak	META-INF/db2-jpa-changelog-1.9.1.xml	2023-09-04 08:09:57.218932	25	MARK_RAN	8:11a788aed4961d6d29c427c063af828c	modifyDataType columnName=PRIVATE_KEY, tableName=REALM; modifyDataType columnName=CERTIFICATE, tableName=REALM		\N	4.8.0	\N	\N	3814995661
1.9.2	keycloak	META-INF/jpa-changelog-1.9.2.xml	2023-09-04 08:09:57.265526	26	EXECUTED	8:a4218e51e1faf380518cce2af5d39b43	createIndex indexName=IDX_USER_EMAIL, tableName=USER_ENTITY; createIndex indexName=IDX_USER_ROLE_MAPPING, tableName=USER_ROLE_MAPPING; createIndex indexName=IDX_USER_GROUP_MAPPING, tableName=USER_GROUP_MEMBERSHIP; createIndex indexName=IDX_USER_CO...		\N	4.8.0	\N	\N	3814995661
authz-2.0.0	psilva@redhat.com	META-INF/jpa-changelog-authz-2.0.0.xml	2023-09-04 08:09:57.388843	27	EXECUTED	8:d9e9a1bfaa644da9952456050f07bbdc	createTable tableName=RESOURCE_SERVER; addPrimaryKey constraintName=CONSTRAINT_FARS, tableName=RESOURCE_SERVER; addUniqueConstraint constraintName=UK_AU8TT6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER; createTable tableName=RESOURCE_SERVER_RESOU...		\N	4.8.0	\N	\N	3814995661
authz-2.5.1	psilva@redhat.com	META-INF/jpa-changelog-authz-2.5.1.xml	2023-09-04 08:09:57.392007	28	EXECUTED	8:d1bf991a6163c0acbfe664b615314505	update tableName=RESOURCE_SERVER_POLICY		\N	4.8.0	\N	\N	3814995661
2.1.0-KEYCLOAK-5461	bburke@redhat.com	META-INF/jpa-changelog-2.1.0.xml	2023-09-04 08:09:57.494595	29	EXECUTED	8:88a743a1e87ec5e30bf603da68058a8c	createTable tableName=BROKER_LINK; createTable tableName=FED_USER_ATTRIBUTE; createTable tableName=FED_USER_CONSENT; createTable tableName=FED_USER_CONSENT_ROLE; createTable tableName=FED_USER_CONSENT_PROT_MAPPER; createTable tableName=FED_USER_CR...		\N	4.8.0	\N	\N	3814995661
2.2.0	bburke@redhat.com	META-INF/jpa-changelog-2.2.0.xml	2023-09-04 08:09:57.518368	30	EXECUTED	8:c5517863c875d325dea463d00ec26d7a	addColumn tableName=ADMIN_EVENT_ENTITY; createTable tableName=CREDENTIAL_ATTRIBUTE; createTable tableName=FED_CREDENTIAL_ATTRIBUTE; modifyDataType columnName=VALUE, tableName=CREDENTIAL; addForeignKeyConstraint baseTableName=FED_CREDENTIAL_ATTRIBU...		\N	4.8.0	\N	\N	3814995661
2.3.0	bburke@redhat.com	META-INF/jpa-changelog-2.3.0.xml	2023-09-04 08:09:57.541429	31	EXECUTED	8:ada8b4833b74a498f376d7136bc7d327	createTable tableName=FEDERATED_USER; addPrimaryKey constraintName=CONSTR_FEDERATED_USER, tableName=FEDERATED_USER; dropDefaultValue columnName=TOTP, tableName=USER_ENTITY; dropColumn columnName=TOTP, tableName=USER_ENTITY; addColumn tableName=IDE...		\N	4.8.0	\N	\N	3814995661
2.4.0	bburke@redhat.com	META-INF/jpa-changelog-2.4.0.xml	2023-09-04 08:09:57.545877	32	EXECUTED	8:b9b73c8ea7299457f99fcbb825c263ba	customChange		\N	4.8.0	\N	\N	3814995661
2.5.0	bburke@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2023-09-04 08:09:57.551371	33	EXECUTED	8:07724333e625ccfcfc5adc63d57314f3	customChange; modifyDataType columnName=USER_ID, tableName=OFFLINE_USER_SESSION		\N	4.8.0	\N	\N	3814995661
2.5.0-unicode-oracle	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2023-09-04 08:09:57.553103	34	MARK_RAN	8:8b6fd445958882efe55deb26fc541a7b	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.8.0	\N	\N	3814995661
2.5.0-unicode-other-dbs	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2023-09-04 08:09:57.58938	35	EXECUTED	8:29b29cfebfd12600897680147277a9d7	modifyDataType columnName=DESCRIPTION, tableName=AUTHENTICATION_FLOW; modifyDataType columnName=DESCRIPTION, tableName=CLIENT_TEMPLATE; modifyDataType columnName=DESCRIPTION, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=DESCRIPTION,...		\N	4.8.0	\N	\N	3814995661
2.5.0-duplicate-email-support	slawomir@dabek.name	META-INF/jpa-changelog-2.5.0.xml	2023-09-04 08:09:57.594814	36	EXECUTED	8:73ad77ca8fd0410c7f9f15a471fa52bc	addColumn tableName=REALM		\N	4.8.0	\N	\N	3814995661
2.5.0-unique-group-names	hmlnarik@redhat.com	META-INF/jpa-changelog-2.5.0.xml	2023-09-04 08:09:57.603001	37	EXECUTED	8:64f27a6fdcad57f6f9153210f2ec1bdb	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.8.0	\N	\N	3814995661
2.5.1	bburke@redhat.com	META-INF/jpa-changelog-2.5.1.xml	2023-09-04 08:09:57.607044	38	EXECUTED	8:27180251182e6c31846c2ddab4bc5781	addColumn tableName=FED_USER_CONSENT		\N	4.8.0	\N	\N	3814995661
3.0.0	bburke@redhat.com	META-INF/jpa-changelog-3.0.0.xml	2023-09-04 08:09:57.611457	39	EXECUTED	8:d56f201bfcfa7a1413eb3e9bc02978f9	addColumn tableName=IDENTITY_PROVIDER		\N	4.8.0	\N	\N	3814995661
3.2.0-fix	keycloak	META-INF/jpa-changelog-3.2.0.xml	2023-09-04 08:09:57.614498	40	MARK_RAN	8:91f5522bf6afdc2077dfab57fbd3455c	addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS		\N	4.8.0	\N	\N	3814995661
3.2.0-fix-with-keycloak-5416	keycloak	META-INF/jpa-changelog-3.2.0.xml	2023-09-04 08:09:57.617093	41	MARK_RAN	8:0f01b554f256c22caeb7d8aee3a1cdc8	dropIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS; addNotNullConstraint columnName=REALM_ID, tableName=CLIENT_INITIAL_ACCESS; createIndex indexName=IDX_CLIENT_INIT_ACC_REALM, tableName=CLIENT_INITIAL_ACCESS		\N	4.8.0	\N	\N	3814995661
3.2.0-fix-offline-sessions	hmlnarik	META-INF/jpa-changelog-3.2.0.xml	2023-09-04 08:09:57.623134	42	EXECUTED	8:ab91cf9cee415867ade0e2df9651a947	customChange		\N	4.8.0	\N	\N	3814995661
3.2.0-fixed	keycloak	META-INF/jpa-changelog-3.2.0.xml	2023-09-04 08:09:57.825185	43	EXECUTED	8:ceac9b1889e97d602caf373eadb0d4b7	addColumn tableName=REALM; dropPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_PK2, tableName=OFFLINE_CLIENT_SESSION; dropColumn columnName=CLIENT_SESSION_ID, tableName=OFFLINE_CLIENT_SESSION; addPrimaryKey constraintName=CONSTRAINT_OFFL_CL_SES_P...		\N	4.8.0	\N	\N	3814995661
3.3.0	keycloak	META-INF/jpa-changelog-3.3.0.xml	2023-09-04 08:09:57.829273	44	EXECUTED	8:84b986e628fe8f7fd8fd3c275c5259f2	addColumn tableName=USER_ENTITY		\N	4.8.0	\N	\N	3814995661
authz-3.4.0.CR1-resource-server-pk-change-part2-KEYCLOAK-6095	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2023-09-04 08:09:57.838289	46	EXECUTED	8:70a2b4f1f4bd4dbf487114bdb1810e64	customChange		\N	4.8.0	\N	\N	3814995661
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2023-09-04 08:09:57.842346	47	MARK_RAN	8:7be68b71d2f5b94b8df2e824f2860fa2	dropIndex indexName=IDX_RES_SERV_POL_RES_SERV, tableName=RESOURCE_SERVER_POLICY; dropIndex indexName=IDX_RES_SRV_RES_RES_SRV, tableName=RESOURCE_SERVER_RESOURCE; dropIndex indexName=IDX_RES_SRV_SCOPE_RES_SRV, tableName=RESOURCE_SERVER_SCOPE		\N	4.8.0	\N	\N	3814995661
authz-3.4.0.CR1-resource-server-pk-change-part3-fixed-nodropindex	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2023-09-04 08:09:57.894011	48	EXECUTED	8:bab7c631093c3861d6cf6144cd944982	addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_POLICY; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, tableName=RESOURCE_SERVER_RESOURCE; addNotNullConstraint columnName=RESOURCE_SERVER_CLIENT_ID, ...		\N	4.8.0	\N	\N	3814995661
authn-3.4.0.CR1-refresh-token-max-reuse	glavoie@gmail.com	META-INF/jpa-changelog-authz-3.4.0.CR1.xml	2023-09-04 08:09:57.89929	49	EXECUTED	8:fa809ac11877d74d76fe40869916daad	addColumn tableName=REALM		\N	4.8.0	\N	\N	3814995661
3.4.0	keycloak	META-INF/jpa-changelog-3.4.0.xml	2023-09-04 08:09:57.959919	50	EXECUTED	8:fac23540a40208f5f5e326f6ceb4d291	addPrimaryKey constraintName=CONSTRAINT_REALM_DEFAULT_ROLES, tableName=REALM_DEFAULT_ROLES; addPrimaryKey constraintName=CONSTRAINT_COMPOSITE_ROLE, tableName=COMPOSITE_ROLE; addPrimaryKey constraintName=CONSTR_REALM_DEFAULT_GROUPS, tableName=REALM...		\N	4.8.0	\N	\N	3814995661
3.4.0-KEYCLOAK-5230	hmlnarik@redhat.com	META-INF/jpa-changelog-3.4.0.xml	2023-09-04 08:09:58.003653	51	EXECUTED	8:2612d1b8a97e2b5588c346e817307593	createIndex indexName=IDX_FU_ATTRIBUTE, tableName=FED_USER_ATTRIBUTE; createIndex indexName=IDX_FU_CONSENT, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CONSENT_RU, tableName=FED_USER_CONSENT; createIndex indexName=IDX_FU_CREDENTIAL, t...		\N	4.8.0	\N	\N	3814995661
3.4.1	psilva@redhat.com	META-INF/jpa-changelog-3.4.1.xml	2023-09-04 08:09:58.007767	52	EXECUTED	8:9842f155c5db2206c88bcb5d1046e941	modifyDataType columnName=VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	3814995661
3.4.2	keycloak	META-INF/jpa-changelog-3.4.2.xml	2023-09-04 08:09:58.01276	53	EXECUTED	8:2e12e06e45498406db72d5b3da5bbc76	update tableName=REALM		\N	4.8.0	\N	\N	3814995661
3.4.2-KEYCLOAK-5172	mkanis@redhat.com	META-INF/jpa-changelog-3.4.2.xml	2023-09-04 08:09:58.016511	54	EXECUTED	8:33560e7c7989250c40da3abdabdc75a4	update tableName=CLIENT		\N	4.8.0	\N	\N	3814995661
4.0.0-KEYCLOAK-6335	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2023-09-04 08:09:58.024966	55	EXECUTED	8:87a8d8542046817a9107c7eb9cbad1cd	createTable tableName=CLIENT_AUTH_FLOW_BINDINGS; addPrimaryKey constraintName=C_CLI_FLOW_BIND, tableName=CLIENT_AUTH_FLOW_BINDINGS		\N	4.8.0	\N	\N	3814995661
4.0.0-CLEANUP-UNUSED-TABLE	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2023-09-04 08:09:58.033114	56	EXECUTED	8:3ea08490a70215ed0088c273d776311e	dropTable tableName=CLIENT_IDENTITY_PROV_MAPPING		\N	4.8.0	\N	\N	3814995661
4.0.0-KEYCLOAK-6228	bburke@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2023-09-04 08:09:58.060017	57	EXECUTED	8:2d56697c8723d4592ab608ce14b6ed68	dropUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHOGM8UEWRT, tableName=USER_CONSENT; dropNotNullConstraint columnName=CLIENT_ID, tableName=USER_CONSENT; addColumn tableName=USER_CONSENT; addUniqueConstraint constraintName=UK_JKUWUVD56ONTGSUHO...		\N	4.8.0	\N	\N	3814995661
4.0.0-KEYCLOAK-5579-fixed	mposolda@redhat.com	META-INF/jpa-changelog-4.0.0.xml	2023-09-04 08:09:58.199519	58	EXECUTED	8:3e423e249f6068ea2bbe48bf907f9d86	dropForeignKeyConstraint baseTableName=CLIENT_TEMPLATE_ATTRIBUTES, constraintName=FK_CL_TEMPL_ATTR_TEMPL; renameTable newTableName=CLIENT_SCOPE_ATTRIBUTES, oldTableName=CLIENT_TEMPLATE_ATTRIBUTES; renameColumn newColumnName=SCOPE_ID, oldColumnName...		\N	4.8.0	\N	\N	3814995661
authz-4.0.0.CR1	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.CR1.xml	2023-09-04 08:09:58.246238	59	EXECUTED	8:15cabee5e5df0ff099510a0fc03e4103	createTable tableName=RESOURCE_SERVER_PERM_TICKET; addPrimaryKey constraintName=CONSTRAINT_FAPMT, tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRHO213XCX4WNKOG82SSPMT...		\N	4.8.0	\N	\N	3814995661
authz-4.0.0.Beta3	psilva@redhat.com	META-INF/jpa-changelog-authz-4.0.0.Beta3.xml	2023-09-04 08:09:58.254489	60	EXECUTED	8:4b80200af916ac54d2ffbfc47918ab0e	addColumn tableName=RESOURCE_SERVER_POLICY; addColumn tableName=RESOURCE_SERVER_PERM_TICKET; addForeignKeyConstraint baseTableName=RESOURCE_SERVER_PERM_TICKET, constraintName=FK_FRSRPO2128CX4WNKOG82SSRFY, referencedTableName=RESOURCE_SERVER_POLICY		\N	4.8.0	\N	\N	3814995661
authz-4.2.0.Final	mhajas@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2023-09-04 08:09:58.262759	61	EXECUTED	8:66564cd5e168045d52252c5027485bbb	createTable tableName=RESOURCE_URIS; addForeignKeyConstraint baseTableName=RESOURCE_URIS, constraintName=FK_RESOURCE_SERVER_URIS, referencedTableName=RESOURCE_SERVER_RESOURCE; customChange; dropColumn columnName=URI, tableName=RESOURCE_SERVER_RESO...		\N	4.8.0	\N	\N	3814995661
authz-4.2.0.Final-KEYCLOAK-9944	hmlnarik@redhat.com	META-INF/jpa-changelog-authz-4.2.0.Final.xml	2023-09-04 08:09:58.270779	62	EXECUTED	8:1c7064fafb030222be2bd16ccf690f6f	addPrimaryKey constraintName=CONSTRAINT_RESOUR_URIS_PK, tableName=RESOURCE_URIS		\N	4.8.0	\N	\N	3814995661
4.2.0-KEYCLOAK-6313	wadahiro@gmail.com	META-INF/jpa-changelog-4.2.0.xml	2023-09-04 08:09:58.273759	63	EXECUTED	8:2de18a0dce10cdda5c7e65c9b719b6e5	addColumn tableName=REQUIRED_ACTION_PROVIDER		\N	4.8.0	\N	\N	3814995661
4.3.0-KEYCLOAK-7984	wadahiro@gmail.com	META-INF/jpa-changelog-4.3.0.xml	2023-09-04 08:09:58.275989	64	EXECUTED	8:03e413dd182dcbd5c57e41c34d0ef682	update tableName=REQUIRED_ACTION_PROVIDER		\N	4.8.0	\N	\N	3814995661
4.6.0-KEYCLOAK-7950	psilva@redhat.com	META-INF/jpa-changelog-4.6.0.xml	2023-09-04 08:09:58.281535	65	EXECUTED	8:d27b42bb2571c18fbe3fe4e4fb7582a7	update tableName=RESOURCE_SERVER_RESOURCE		\N	4.8.0	\N	\N	3814995661
4.6.0-KEYCLOAK-8377	keycloak	META-INF/jpa-changelog-4.6.0.xml	2023-09-04 08:09:58.303744	66	EXECUTED	8:698baf84d9fd0027e9192717c2154fb8	createTable tableName=ROLE_ATTRIBUTE; addPrimaryKey constraintName=CONSTRAINT_ROLE_ATTRIBUTE_PK, tableName=ROLE_ATTRIBUTE; addForeignKeyConstraint baseTableName=ROLE_ATTRIBUTE, constraintName=FK_ROLE_ATTRIBUTE_ID, referencedTableName=KEYCLOAK_ROLE...		\N	4.8.0	\N	\N	3814995661
4.6.0-KEYCLOAK-8555	gideonray@gmail.com	META-INF/jpa-changelog-4.6.0.xml	2023-09-04 08:09:58.311918	67	EXECUTED	8:ced8822edf0f75ef26eb51582f9a821a	createIndex indexName=IDX_COMPONENT_PROVIDER_TYPE, tableName=COMPONENT		\N	4.8.0	\N	\N	3814995661
4.7.0-KEYCLOAK-1267	sguilhen@redhat.com	META-INF/jpa-changelog-4.7.0.xml	2023-09-04 08:09:58.317586	68	EXECUTED	8:f0abba004cf429e8afc43056df06487d	addColumn tableName=REALM		\N	4.8.0	\N	\N	3814995661
4.7.0-KEYCLOAK-7275	keycloak	META-INF/jpa-changelog-4.7.0.xml	2023-09-04 08:09:58.329467	69	EXECUTED	8:6662f8b0b611caa359fcf13bf63b4e24	renameColumn newColumnName=CREATED_ON, oldColumnName=LAST_SESSION_REFRESH, tableName=OFFLINE_USER_SESSION; addNotNullConstraint columnName=CREATED_ON, tableName=OFFLINE_USER_SESSION; addColumn tableName=OFFLINE_USER_SESSION; customChange; createIn...		\N	4.8.0	\N	\N	3814995661
4.8.0-KEYCLOAK-8835	sguilhen@redhat.com	META-INF/jpa-changelog-4.8.0.xml	2023-09-04 08:09:58.334863	70	EXECUTED	8:9e6b8009560f684250bdbdf97670d39e	addNotNullConstraint columnName=SSO_MAX_LIFESPAN_REMEMBER_ME, tableName=REALM; addNotNullConstraint columnName=SSO_IDLE_TIMEOUT_REMEMBER_ME, tableName=REALM		\N	4.8.0	\N	\N	3814995661
authz-7.0.0-KEYCLOAK-10443	psilva@redhat.com	META-INF/jpa-changelog-authz-7.0.0.xml	2023-09-04 08:09:58.338599	71	EXECUTED	8:4223f561f3b8dc655846562b57bb502e	addColumn tableName=RESOURCE_SERVER		\N	4.8.0	\N	\N	3814995661
8.0.0-adding-credential-columns	keycloak	META-INF/jpa-changelog-8.0.0.xml	2023-09-04 08:09:58.345173	72	EXECUTED	8:215a31c398b363ce383a2b301202f29e	addColumn tableName=CREDENTIAL; addColumn tableName=FED_USER_CREDENTIAL		\N	4.8.0	\N	\N	3814995661
8.0.0-updating-credential-data-not-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2023-09-04 08:09:58.350743	73	EXECUTED	8:83f7a671792ca98b3cbd3a1a34862d3d	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.8.0	\N	\N	3814995661
8.0.0-updating-credential-data-oracle-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2023-09-04 08:09:58.352616	74	MARK_RAN	8:f58ad148698cf30707a6efbdf8061aa7	update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL; update tableName=FED_USER_CREDENTIAL		\N	4.8.0	\N	\N	3814995661
8.0.0-credential-cleanup-fixed	keycloak	META-INF/jpa-changelog-8.0.0.xml	2023-09-04 08:09:58.377636	75	EXECUTED	8:79e4fd6c6442980e58d52ffc3ee7b19c	dropDefaultValue columnName=COUNTER, tableName=CREDENTIAL; dropDefaultValue columnName=DIGITS, tableName=CREDENTIAL; dropDefaultValue columnName=PERIOD, tableName=CREDENTIAL; dropDefaultValue columnName=ALGORITHM, tableName=CREDENTIAL; dropColumn ...		\N	4.8.0	\N	\N	3814995661
8.0.0-resource-tag-support	keycloak	META-INF/jpa-changelog-8.0.0.xml	2023-09-04 08:09:58.387349	76	EXECUTED	8:87af6a1e6d241ca4b15801d1f86a297d	addColumn tableName=MIGRATION_MODEL; createIndex indexName=IDX_UPDATE_TIME, tableName=MIGRATION_MODEL		\N	4.8.0	\N	\N	3814995661
9.0.0-always-display-client	keycloak	META-INF/jpa-changelog-9.0.0.xml	2023-09-04 08:09:58.391857	77	EXECUTED	8:b44f8d9b7b6ea455305a6d72a200ed15	addColumn tableName=CLIENT		\N	4.8.0	\N	\N	3814995661
9.0.0-drop-constraints-for-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2023-09-04 08:09:58.394099	78	MARK_RAN	8:2d8ed5aaaeffd0cb004c046b4a903ac5	dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5PMT, tableName=RESOURCE_SERVER_PERM_TICKET; dropUniqueConstraint constraintName=UK_FRSR6T700S9V50BU18WS5HA6, tableName=RESOURCE_SERVER_RESOURCE; dropPrimaryKey constraintName=CONSTRAINT_O...		\N	4.8.0	\N	\N	3814995661
9.0.0-increase-column-size-federated-fk	keycloak	META-INF/jpa-changelog-9.0.0.xml	2023-09-04 08:09:58.425865	79	EXECUTED	8:e290c01fcbc275326c511633f6e2acde	modifyDataType columnName=CLIENT_ID, tableName=FED_USER_CONSENT; modifyDataType columnName=CLIENT_REALM_CONSTRAINT, tableName=KEYCLOAK_ROLE; modifyDataType columnName=OWNER, tableName=RESOURCE_SERVER_POLICY; modifyDataType columnName=CLIENT_ID, ta...		\N	4.8.0	\N	\N	3814995661
9.0.0-recreate-constraints-after-column-increase	keycloak	META-INF/jpa-changelog-9.0.0.xml	2023-09-04 08:09:58.427752	80	MARK_RAN	8:c9db8784c33cea210872ac2d805439f8	addNotNullConstraint columnName=CLIENT_ID, tableName=OFFLINE_CLIENT_SESSION; addNotNullConstraint columnName=OWNER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNullConstraint columnName=REQUESTER, tableName=RESOURCE_SERVER_PERM_TICKET; addNotNull...		\N	4.8.0	\N	\N	3814995661
9.0.1-add-index-to-client.client_id	keycloak	META-INF/jpa-changelog-9.0.1.xml	2023-09-04 08:09:58.435237	81	EXECUTED	8:95b676ce8fc546a1fcfb4c92fae4add5	createIndex indexName=IDX_CLIENT_ID, tableName=CLIENT		\N	4.8.0	\N	\N	3814995661
9.0.1-KEYCLOAK-12579-drop-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2023-09-04 08:09:58.437518	82	MARK_RAN	8:38a6b2a41f5651018b1aca93a41401e5	dropUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.8.0	\N	\N	3814995661
9.0.1-KEYCLOAK-12579-add-not-null-constraint	keycloak	META-INF/jpa-changelog-9.0.1.xml	2023-09-04 08:09:58.442088	83	EXECUTED	8:3fb99bcad86a0229783123ac52f7609c	addNotNullConstraint columnName=PARENT_GROUP, tableName=KEYCLOAK_GROUP		\N	4.8.0	\N	\N	3814995661
9.0.1-KEYCLOAK-12579-recreate-constraints	keycloak	META-INF/jpa-changelog-9.0.1.xml	2023-09-04 08:09:58.443896	84	MARK_RAN	8:64f27a6fdcad57f6f9153210f2ec1bdb	addUniqueConstraint constraintName=SIBLING_NAMES, tableName=KEYCLOAK_GROUP		\N	4.8.0	\N	\N	3814995661
9.0.1-add-index-to-events	keycloak	META-INF/jpa-changelog-9.0.1.xml	2023-09-04 08:09:58.451192	85	EXECUTED	8:ab4f863f39adafd4c862f7ec01890abc	createIndex indexName=IDX_EVENT_TIME, tableName=EVENT_ENTITY		\N	4.8.0	\N	\N	3814995661
map-remove-ri	keycloak	META-INF/jpa-changelog-11.0.0.xml	2023-09-04 08:09:58.459314	86	EXECUTED	8:13c419a0eb336e91ee3a3bf8fda6e2a7	dropForeignKeyConstraint baseTableName=REALM, constraintName=FK_TRAF444KK6QRKMS7N56AIWQ5Y; dropForeignKeyConstraint baseTableName=KEYCLOAK_ROLE, constraintName=FK_KJHO5LE2C0RAL09FL8CM9WFW9		\N	4.8.0	\N	\N	3814995661
map-remove-ri	keycloak	META-INF/jpa-changelog-12.0.0.xml	2023-09-04 08:09:58.477121	87	EXECUTED	8:e3fb1e698e0471487f51af1ed80fe3ac	dropForeignKeyConstraint baseTableName=REALM_DEFAULT_GROUPS, constraintName=FK_DEF_GROUPS_GROUP; dropForeignKeyConstraint baseTableName=REALM_DEFAULT_ROLES, constraintName=FK_H4WPD7W4HSOOLNI3H0SW7BTJE; dropForeignKeyConstraint baseTableName=CLIENT...		\N	4.8.0	\N	\N	3814995661
12.1.0-add-realm-localization-table	keycloak	META-INF/jpa-changelog-12.0.0.xml	2023-09-04 08:09:58.49277	88	EXECUTED	8:babadb686aab7b56562817e60bf0abd0	createTable tableName=REALM_LOCALIZATIONS; addPrimaryKey tableName=REALM_LOCALIZATIONS		\N	4.8.0	\N	\N	3814995661
default-roles	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-09-04 08:09:58.50371	89	EXECUTED	8:72d03345fda8e2f17093d08801947773	addColumn tableName=REALM; customChange		\N	4.8.0	\N	\N	3814995661
default-roles-cleanup	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-09-04 08:09:58.517601	90	EXECUTED	8:61c9233951bd96ffecd9ba75f7d978a4	dropTable tableName=REALM_DEFAULT_ROLES; dropTable tableName=CLIENT_DEFAULT_ROLES		\N	4.8.0	\N	\N	3814995661
13.0.0-KEYCLOAK-16844	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-09-04 08:09:58.526865	91	EXECUTED	8:ea82e6ad945cec250af6372767b25525	createIndex indexName=IDX_OFFLINE_USS_PRELOAD, tableName=OFFLINE_USER_SESSION		\N	4.8.0	\N	\N	3814995661
map-remove-ri-13.0.0	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-09-04 08:09:58.546295	92	EXECUTED	8:d3f4a33f41d960ddacd7e2ef30d126b3	dropForeignKeyConstraint baseTableName=DEFAULT_CLIENT_SCOPE, constraintName=FK_R_DEF_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SCOPE_CLIENT, constraintName=FK_C_CLI_SCOPE_SCOPE; dropForeignKeyConstraint baseTableName=CLIENT_SC...		\N	4.8.0	\N	\N	3814995661
13.0.0-KEYCLOAK-17992-drop-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-09-04 08:09:58.548971	93	MARK_RAN	8:1284a27fbd049d65831cb6fc07c8a783	dropPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CLSCOPE_CL, tableName=CLIENT_SCOPE_CLIENT; dropIndex indexName=IDX_CL_CLSCOPE, tableName=CLIENT_SCOPE_CLIENT		\N	4.8.0	\N	\N	3814995661
13.0.0-increase-column-size-federated	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-09-04 08:09:58.565288	94	EXECUTED	8:9d11b619db2ae27c25853b8a37cd0dea	modifyDataType columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; modifyDataType columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT		\N	4.8.0	\N	\N	3814995661
13.0.0-KEYCLOAK-17992-recreate-constraints	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-09-04 08:09:58.568248	95	MARK_RAN	8:3002bb3997451bb9e8bac5c5cd8d6327	addNotNullConstraint columnName=CLIENT_ID, tableName=CLIENT_SCOPE_CLIENT; addNotNullConstraint columnName=SCOPE_ID, tableName=CLIENT_SCOPE_CLIENT; addPrimaryKey constraintName=C_CLI_SCOPE_BIND, tableName=CLIENT_SCOPE_CLIENT; createIndex indexName=...		\N	4.8.0	\N	\N	3814995661
json-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-13.0.0.xml	2023-09-04 08:09:58.575865	96	EXECUTED	8:dfbee0d6237a23ef4ccbb7a4e063c163	addColumn tableName=REALM_ATTRIBUTE; update tableName=REALM_ATTRIBUTE; dropColumn columnName=VALUE, tableName=REALM_ATTRIBUTE; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=REALM_ATTRIBUTE		\N	4.8.0	\N	\N	3814995661
14.0.0-KEYCLOAK-11019	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-09-04 08:09:58.591257	97	EXECUTED	8:75f3e372df18d38c62734eebb986b960	createIndex indexName=IDX_OFFLINE_CSS_PRELOAD, tableName=OFFLINE_CLIENT_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USER, tableName=OFFLINE_USER_SESSION; createIndex indexName=IDX_OFFLINE_USS_BY_USERSESS, tableName=OFFLINE_USER_SESSION		\N	4.8.0	\N	\N	3814995661
14.0.0-KEYCLOAK-18286	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-09-04 08:09:58.592996	98	MARK_RAN	8:7fee73eddf84a6035691512c85637eef	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	3814995661
14.0.0-KEYCLOAK-18286-revert	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-09-04 08:09:58.612729	99	MARK_RAN	8:7a11134ab12820f999fbf3bb13c3adc8	dropIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	3814995661
14.0.0-KEYCLOAK-18286-supported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-09-04 08:09:58.620179	100	EXECUTED	8:c0f6eaac1f3be773ffe54cb5b8482b70	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	3814995661
14.0.0-KEYCLOAK-18286-unsupported-dbs	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-09-04 08:09:58.622486	101	MARK_RAN	8:18186f0008b86e0f0f49b0c4d0e842ac	createIndex indexName=IDX_CLIENT_ATT_BY_NAME_VALUE, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	3814995661
KEYCLOAK-17267-add-index-to-user-attributes	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-09-04 08:09:58.629178	102	EXECUTED	8:09c2780bcb23b310a7019d217dc7b433	createIndex indexName=IDX_USER_ATTRIBUTE_NAME, tableName=USER_ATTRIBUTE		\N	4.8.0	\N	\N	3814995661
KEYCLOAK-18146-add-saml-art-binding-identifier	keycloak	META-INF/jpa-changelog-14.0.0.xml	2023-09-04 08:09:58.635478	103	EXECUTED	8:276a44955eab693c970a42880197fff2	customChange		\N	4.8.0	\N	\N	3814995661
15.0.0-KEYCLOAK-18467	keycloak	META-INF/jpa-changelog-15.0.0.xml	2023-09-04 08:09:58.642406	104	EXECUTED	8:ba8ee3b694d043f2bfc1a1079d0760d7	addColumn tableName=REALM_LOCALIZATIONS; update tableName=REALM_LOCALIZATIONS; dropColumn columnName=TEXTS, tableName=REALM_LOCALIZATIONS; renameColumn newColumnName=TEXTS, oldColumnName=TEXTS_NEW, tableName=REALM_LOCALIZATIONS; addNotNullConstrai...		\N	4.8.0	\N	\N	3814995661
17.0.0-9562	keycloak	META-INF/jpa-changelog-17.0.0.xml	2023-09-04 08:09:58.649428	105	EXECUTED	8:5e06b1d75f5d17685485e610c2851b17	createIndex indexName=IDX_USER_SERVICE_ACCOUNT, tableName=USER_ENTITY		\N	4.8.0	\N	\N	3814995661
18.0.0-10625-IDX_ADMIN_EVENT_TIME	keycloak	META-INF/jpa-changelog-18.0.0.xml	2023-09-04 08:09:58.656009	106	EXECUTED	8:4b80546c1dc550ac552ee7b24a4ab7c0	createIndex indexName=IDX_ADMIN_EVENT_TIME, tableName=ADMIN_EVENT_ENTITY		\N	4.8.0	\N	\N	3814995661
19.0.0-10135	keycloak	META-INF/jpa-changelog-19.0.0.xml	2023-09-04 08:09:58.660918	107	EXECUTED	8:af510cd1bb2ab6339c45372f3e491696	customChange		\N	4.8.0	\N	\N	3814995661
20.0.0-12964-supported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2023-09-04 08:09:58.668124	108	EXECUTED	8:05c99fc610845ef66ee812b7921af0ef	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.8.0	\N	\N	3814995661
20.0.0-12964-unsupported-dbs	keycloak	META-INF/jpa-changelog-20.0.0.xml	2023-09-04 08:09:58.669894	109	MARK_RAN	8:314e803baf2f1ec315b3464e398b8247	createIndex indexName=IDX_GROUP_ATT_BY_NAME_VALUE, tableName=GROUP_ATTRIBUTE		\N	4.8.0	\N	\N	3814995661
client-attributes-string-accomodation-fixed	keycloak	META-INF/jpa-changelog-20.0.0.xml	2023-09-04 08:09:58.676037	110	EXECUTED	8:56e4677e7e12556f70b604c573840100	addColumn tableName=CLIENT_ATTRIBUTES; update tableName=CLIENT_ATTRIBUTES; dropColumn columnName=VALUE, tableName=CLIENT_ATTRIBUTES; renameColumn newColumnName=VALUE, oldColumnName=VALUE_NEW, tableName=CLIENT_ATTRIBUTES		\N	4.8.0	\N	\N	3814995661
\.


--
-- Data for Name: databasechangeloglock; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
1	f	\N	\N
1000	f	\N	\N
1001	f	\N	\N
\.


--
-- Data for Name: default_client_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.default_client_scope (realm_id, scope_id, default_scope) FROM stdin;
cb657751-60e1-4583-91be-f6ae0b5826d5	7598e7f2-dbae-4657-bd9a-e6e7b80b683a	f
cb657751-60e1-4583-91be-f6ae0b5826d5	0561e09b-0776-4650-80c0-b4769a02d63a	t
cb657751-60e1-4583-91be-f6ae0b5826d5	0410aa29-458c-418d-9097-b54e3f68460c	t
cb657751-60e1-4583-91be-f6ae0b5826d5	af32fa91-fd8a-4142-9a2f-cd5e04c61f61	t
cb657751-60e1-4583-91be-f6ae0b5826d5	f9711ac9-2c44-4d0d-a281-926d355c19af	f
cb657751-60e1-4583-91be-f6ae0b5826d5	5a83a323-4899-4241-a0cd-5f555dec2719	f
cb657751-60e1-4583-91be-f6ae0b5826d5	618562ba-a542-447e-8b16-68351e2ee465	t
cb657751-60e1-4583-91be-f6ae0b5826d5	9543b9a7-54ab-45bc-b657-8bb53604d2ff	t
cb657751-60e1-4583-91be-f6ae0b5826d5	b45bda6d-0232-4354-909e-6bb095ed6fca	f
cb657751-60e1-4583-91be-f6ae0b5826d5	f584b95f-51a7-444e-b77f-0dd99e69a55e	t
94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	6f0fb755-373f-4e0a-8266-2901c8064c19	f
94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	2323b68d-0c37-414c-af0a-00ba5027d928	t
94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	7430d820-79aa-4941-9514-b90fb5bf8bda	t
94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	198b19b7-eb14-48a2-a93e-777e550efa0f	t
94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	99137542-ae7d-41c9-a837-c0f731719a5b	f
94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	d02d6f13-a231-4baa-abde-d138cb50e380	f
94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	036b53ee-aa81-48fb-9708-c7a311055ed3	t
94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	394978fc-531e-498a-b928-48d65b1fa1a9	t
94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	3897407b-0338-4aec-8402-b81918290d6c	f
94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	15c94410-a2f6-4cc8-8a80-21483730906e	t
\.


--
-- Data for Name: event_entity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.event_entity (id, client_id, details_json, error, ip_address, realm_id, session_id, event_time, type, user_id) FROM stdin;
\.


--
-- Data for Name: fed_user_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_attribute (id, name, user_id, realm_id, storage_provider_id, value) FROM stdin;
\.


--
-- Data for Name: fed_user_consent; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_consent (id, client_id, user_id, realm_id, storage_provider_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: fed_user_consent_cl_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_consent_cl_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- Data for Name: fed_user_credential; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_credential (id, salt, type, created_date, user_id, realm_id, storage_provider_id, user_label, secret_data, credential_data, priority) FROM stdin;
\.


--
-- Data for Name: fed_user_group_membership; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_group_membership (group_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_required_action; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_required_action (required_action, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: fed_user_role_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fed_user_role_mapping (role_id, user_id, realm_id, storage_provider_id) FROM stdin;
\.


--
-- Data for Name: federated_identity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.federated_identity (identity_provider, realm_id, federated_user_id, federated_username, token, user_id) FROM stdin;
\.


--
-- Data for Name: federated_user; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.federated_user (id, storage_provider_id, realm_id) FROM stdin;
\.


--
-- Data for Name: group_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.group_attribute (id, name, value, group_id) FROM stdin;
\.


--
-- Data for Name: group_role_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.group_role_mapping (role_id, group_id) FROM stdin;
\.


--
-- Data for Name: identity_provider; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.identity_provider (internal_id, enabled, provider_alias, provider_id, store_token, authenticate_by_default, realm_id, add_token_role, trust_email, first_broker_login_flow_id, post_broker_login_flow_id, provider_display_name, link_only) FROM stdin;
\.


--
-- Data for Name: identity_provider_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.identity_provider_config (identity_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: identity_provider_mapper; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.identity_provider_mapper (id, name, idp_alias, idp_mapper_name, realm_id) FROM stdin;
\.


--
-- Data for Name: idp_mapper_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.idp_mapper_config (idp_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: keycloak_group; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.keycloak_group (id, name, parent_group, realm_id) FROM stdin;
\.


--
-- Data for Name: keycloak_role; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.keycloak_role (id, client_realm_constraint, client_role, description, name, realm_id, client, realm) FROM stdin;
49b640bc-5d04-4fe2-9972-ebb298f894ab	cb657751-60e1-4583-91be-f6ae0b5826d5	f	${role_default-roles}	default-roles-master	cb657751-60e1-4583-91be-f6ae0b5826d5	\N	\N
9162c0e7-a951-46e2-b8c6-a36cf313be95	cb657751-60e1-4583-91be-f6ae0b5826d5	f	${role_create-realm}	create-realm	cb657751-60e1-4583-91be-f6ae0b5826d5	\N	\N
e305431f-179a-4ca2-8858-355f4f89e86a	cb657751-60e1-4583-91be-f6ae0b5826d5	f	${role_admin}	admin	cb657751-60e1-4583-91be-f6ae0b5826d5	\N	\N
9f4cff83-b092-403a-aee6-091d088c18af	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_create-client}	create-client	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
8c62ab45-2c76-4de0-8297-28a5b9be603f	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_view-realm}	view-realm	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
9f0bd0bc-5014-4106-87b5-6e03db00a39a	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_view-users}	view-users	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
8bf281e7-9ed9-4aed-bcc2-2a5b0a25fe71	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_view-clients}	view-clients	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
edd30e2d-aa11-4b31-9dc6-c868b29e404b	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_view-events}	view-events	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
74e2b783-d915-446e-94a7-25cb04790b31	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_view-identity-providers}	view-identity-providers	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
c45d1eff-dc04-4c15-9b2f-3de4a9f8deb7	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_view-authorization}	view-authorization	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
2f164030-2c49-4ac5-9ba1-f5e5e0636f72	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_manage-realm}	manage-realm	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
5ea77375-ee0d-4d26-a3d5-86a9046a32fc	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_manage-users}	manage-users	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
621b521a-c623-48ea-bbba-7bb44760f611	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_manage-clients}	manage-clients	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
211dba82-41a0-4ec3-b365-e2c1357e6a18	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_manage-events}	manage-events	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
8d880db8-49b0-4ba2-952d-3b367d0420ad	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_manage-identity-providers}	manage-identity-providers	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
598baf6d-81f1-4db3-8d12-ef23e001acb1	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_manage-authorization}	manage-authorization	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
b6225d93-814f-4716-a4b0-f57d2c9e0c69	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_query-users}	query-users	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
97537824-5edd-415a-988b-4a35b6c685dc	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_query-clients}	query-clients	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
3042a3f2-5901-4b9b-8b44-41cb76e9c8ed	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_query-realms}	query-realms	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
ed31fe68-75ff-49f1-82eb-306b7e823139	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_query-groups}	query-groups	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
8231c469-c362-41ca-9041-8db2bf13d606	410044cd-6864-4906-ae80-06d3ff41ebc9	t	${role_view-profile}	view-profile	cb657751-60e1-4583-91be-f6ae0b5826d5	410044cd-6864-4906-ae80-06d3ff41ebc9	\N
1bfd72c8-c9a2-4140-9375-e8116ec5aff5	410044cd-6864-4906-ae80-06d3ff41ebc9	t	${role_manage-account}	manage-account	cb657751-60e1-4583-91be-f6ae0b5826d5	410044cd-6864-4906-ae80-06d3ff41ebc9	\N
992750de-4bc3-4849-bc72-2896cb2cd84a	410044cd-6864-4906-ae80-06d3ff41ebc9	t	${role_manage-account-links}	manage-account-links	cb657751-60e1-4583-91be-f6ae0b5826d5	410044cd-6864-4906-ae80-06d3ff41ebc9	\N
0bf5eccd-e0c1-491d-99ad-5681e1a15e90	410044cd-6864-4906-ae80-06d3ff41ebc9	t	${role_view-applications}	view-applications	cb657751-60e1-4583-91be-f6ae0b5826d5	410044cd-6864-4906-ae80-06d3ff41ebc9	\N
a30330a9-fd41-4152-a4c3-7506b57622d2	410044cd-6864-4906-ae80-06d3ff41ebc9	t	${role_view-consent}	view-consent	cb657751-60e1-4583-91be-f6ae0b5826d5	410044cd-6864-4906-ae80-06d3ff41ebc9	\N
bd6eb46f-7da7-4aa8-bb8e-a0abffab2a9c	410044cd-6864-4906-ae80-06d3ff41ebc9	t	${role_manage-consent}	manage-consent	cb657751-60e1-4583-91be-f6ae0b5826d5	410044cd-6864-4906-ae80-06d3ff41ebc9	\N
77572be2-192f-45e0-a58d-99d421261613	410044cd-6864-4906-ae80-06d3ff41ebc9	t	${role_view-groups}	view-groups	cb657751-60e1-4583-91be-f6ae0b5826d5	410044cd-6864-4906-ae80-06d3ff41ebc9	\N
4e1775f4-31e8-4687-bfd3-063b2b63dd70	410044cd-6864-4906-ae80-06d3ff41ebc9	t	${role_delete-account}	delete-account	cb657751-60e1-4583-91be-f6ae0b5826d5	410044cd-6864-4906-ae80-06d3ff41ebc9	\N
b49fdde2-f934-4a64-a613-190ecee22953	dba9cbf4-3729-4037-93bc-3abf30da1779	t	${role_read-token}	read-token	cb657751-60e1-4583-91be-f6ae0b5826d5	dba9cbf4-3729-4037-93bc-3abf30da1779	\N
8ed04683-05ce-4721-b756-3bab28142cb3	7018dd8d-2b35-442e-b684-e295c562db46	t	${role_impersonation}	impersonation	cb657751-60e1-4583-91be-f6ae0b5826d5	7018dd8d-2b35-442e-b684-e295c562db46	\N
2340003c-fae8-45af-b235-7d4ef11d7597	cb657751-60e1-4583-91be-f6ae0b5826d5	f	${role_offline-access}	offline_access	cb657751-60e1-4583-91be-f6ae0b5826d5	\N	\N
d4e5d55d-b42d-4e57-8996-fb7592593e74	cb657751-60e1-4583-91be-f6ae0b5826d5	f	${role_uma_authorization}	uma_authorization	cb657751-60e1-4583-91be-f6ae0b5826d5	\N	\N
3c5557bf-bc46-435b-b45f-3e0a6e983f6c	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	f	${role_default-roles}	default-roles-mainzelliste	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	\N	\N
80f2d71a-c475-4b60-a74e-3358617f5a32	d9029962-3755-499d-9a33-f672bb030535	t	${role_create-client}	create-client	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
2c205fd0-6c2a-4af6-8319-1e6e4c2a6663	d9029962-3755-499d-9a33-f672bb030535	t	${role_view-realm}	view-realm	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
2fe923ae-1a93-4e0e-b2f2-75451bd42a40	d9029962-3755-499d-9a33-f672bb030535	t	${role_view-users}	view-users	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
3d589bcb-a28b-4ed3-a45a-614bdeebbacb	d9029962-3755-499d-9a33-f672bb030535	t	${role_view-clients}	view-clients	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
4bf72a4a-c55e-4886-9d5b-935c51195eb8	d9029962-3755-499d-9a33-f672bb030535	t	${role_view-events}	view-events	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
8268ac48-1291-47fc-9310-9b81a8e42469	d9029962-3755-499d-9a33-f672bb030535	t	${role_view-identity-providers}	view-identity-providers	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
024392d4-f3df-465f-9b88-51002ad68b79	d9029962-3755-499d-9a33-f672bb030535	t	${role_view-authorization}	view-authorization	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
6761f446-c29a-4cbf-a5bc-dc823ee871c7	d9029962-3755-499d-9a33-f672bb030535	t	${role_manage-realm}	manage-realm	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
4b481a36-9ccb-4010-9a6d-0466eb2e79e7	d9029962-3755-499d-9a33-f672bb030535	t	${role_manage-users}	manage-users	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
d2c781c6-1e92-4e3c-8228-4fbd20682359	d9029962-3755-499d-9a33-f672bb030535	t	${role_manage-clients}	manage-clients	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
c7aae22b-ca4d-4cc1-863f-f99f1a6e349f	d9029962-3755-499d-9a33-f672bb030535	t	${role_manage-events}	manage-events	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
2abe175c-a0d5-4053-96ba-7585920c7826	d9029962-3755-499d-9a33-f672bb030535	t	${role_manage-identity-providers}	manage-identity-providers	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
928138a7-88f2-4a3c-8054-457b6218cca8	d9029962-3755-499d-9a33-f672bb030535	t	${role_manage-authorization}	manage-authorization	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
fa41f7d0-b648-4d88-8c14-0509d6c6e4c6	d9029962-3755-499d-9a33-f672bb030535	t	${role_query-users}	query-users	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
cf3b97f8-945a-44af-aec6-2d7358c3389a	d9029962-3755-499d-9a33-f672bb030535	t	${role_query-clients}	query-clients	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
8a20342a-92c0-4239-ac0c-c11cfa69382d	d9029962-3755-499d-9a33-f672bb030535	t	${role_query-realms}	query-realms	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
00534edc-21fc-499d-985f-d8eae61426b3	d9029962-3755-499d-9a33-f672bb030535	t	${role_query-groups}	query-groups	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
890d2393-69fb-4b5a-bd92-dc134b881a5b	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_realm-admin}	realm-admin	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
cfac2d4c-ab5f-44b6-81b5-d7bc6cd4152f	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_create-client}	create-client	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
1becb55c-604c-445c-9d48-74c1612ae27e	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_view-realm}	view-realm	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
c37c00c7-a90c-40c4-9271-70d6bc96f2b6	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_view-users}	view-users	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
e7115a2b-e51f-4e7b-9d14-763772421a3b	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_view-clients}	view-clients	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
d32a4c3d-2b5e-477d-9ac6-c6458d127e1d	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_view-events}	view-events	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
464797e0-8d1b-47fe-8d4a-6e01f6c87db7	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_view-identity-providers}	view-identity-providers	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
90885c03-1e3b-4d4a-b82f-61bdb4b5f8b8	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_view-authorization}	view-authorization	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
7511f9dd-d700-4927-9fe2-114c2a63b589	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_manage-realm}	manage-realm	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
4b86f5d0-4bd4-4b8d-8e8b-66dd56178366	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_manage-users}	manage-users	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
f8d8ecf7-63fd-4769-98ec-37c6de7e0ee4	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_manage-clients}	manage-clients	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
533b2fe3-ca4a-4240-bddb-fe7653d22d54	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_manage-events}	manage-events	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
2eb465ec-8dfa-4acb-b5fd-f2eb5e678257	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_manage-identity-providers}	manage-identity-providers	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
c5c70a09-4718-46cb-9b38-76822f0df547	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_manage-authorization}	manage-authorization	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
39c55d12-68cb-4fbe-bb5e-a6aef3211d0f	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_query-users}	query-users	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
ca842fc8-f28d-438a-99a1-64a13f362e2d	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_query-clients}	query-clients	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
88d73c8a-fbe2-429e-b960-d804007fd02f	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_query-realms}	query-realms	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
c9c09956-062f-4577-972e-41718e0f4ac1	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_query-groups}	query-groups	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
d4247d8c-5ce2-45a5-b8a9-56915d4074a6	2ef8ef9a-6b19-45db-99ba-819589ddda1e	t	${role_view-profile}	view-profile	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	2ef8ef9a-6b19-45db-99ba-819589ddda1e	\N
3abd0b3d-00dc-49e7-8f10-bb245a49616a	2ef8ef9a-6b19-45db-99ba-819589ddda1e	t	${role_manage-account}	manage-account	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	2ef8ef9a-6b19-45db-99ba-819589ddda1e	\N
44af8192-ddb8-4f2c-8f8c-44a97a74d0e1	2ef8ef9a-6b19-45db-99ba-819589ddda1e	t	${role_manage-account-links}	manage-account-links	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	2ef8ef9a-6b19-45db-99ba-819589ddda1e	\N
8e3ae3f2-e1a7-4580-b89a-e289329d0f8e	2ef8ef9a-6b19-45db-99ba-819589ddda1e	t	${role_view-applications}	view-applications	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	2ef8ef9a-6b19-45db-99ba-819589ddda1e	\N
b2a760bc-c9d2-4f2c-b279-d45a58b9c923	2ef8ef9a-6b19-45db-99ba-819589ddda1e	t	${role_view-consent}	view-consent	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	2ef8ef9a-6b19-45db-99ba-819589ddda1e	\N
8550cc0a-aa89-498a-bbfc-811e3a465492	2ef8ef9a-6b19-45db-99ba-819589ddda1e	t	${role_manage-consent}	manage-consent	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	2ef8ef9a-6b19-45db-99ba-819589ddda1e	\N
46e47833-fcd0-44d8-8436-d4ad5d8bc37e	2ef8ef9a-6b19-45db-99ba-819589ddda1e	t	${role_view-groups}	view-groups	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	2ef8ef9a-6b19-45db-99ba-819589ddda1e	\N
31abefb1-fd50-4964-82fa-b7a8ee214c37	2ef8ef9a-6b19-45db-99ba-819589ddda1e	t	${role_delete-account}	delete-account	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	2ef8ef9a-6b19-45db-99ba-819589ddda1e	\N
9b7b14c1-963a-40fb-8e48-a0c3b3c8e145	d9029962-3755-499d-9a33-f672bb030535	t	${role_impersonation}	impersonation	cb657751-60e1-4583-91be-f6ae0b5826d5	d9029962-3755-499d-9a33-f672bb030535	\N
38445683-b3d0-410d-9830-71365349f29a	daaf56e1-3e6d-4255-88a4-04e0d9312666	t	${role_impersonation}	impersonation	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	daaf56e1-3e6d-4255-88a4-04e0d9312666	\N
643a84c9-21ee-48a1-a7b8-acc59a754a36	4df2fd4c-f1d3-49cd-832a-2981aabcc3be	t	${role_read-token}	read-token	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	4df2fd4c-f1d3-49cd-832a-2981aabcc3be	\N
8019af4c-cdfd-4baf-8863-8a845075a731	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	f	${role_offline-access}	offline_access	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	\N	\N
48aa0ed1-8b33-4c17-ba50-3eee67fd42a3	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	f	${role_uma_authorization}	uma_authorization	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	\N	\N
\.


--
-- Data for Name: migration_model; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.migration_model (id, version, update_time) FROM stdin;
d447a	20.0.1	1693814998
\.


--
-- Data for Name: offline_client_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.offline_client_session (user_session_id, client_id, offline_flag, "timestamp", data, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: offline_user_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.offline_user_session (user_session_id, user_id, realm_id, created_on, offline_flag, data, last_session_refresh) FROM stdin;
\.


--
-- Data for Name: policy_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.policy_config (policy_id, name, value) FROM stdin;
\.


--
-- Data for Name: protocol_mapper; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.protocol_mapper (id, name, protocol, protocol_mapper_name, client_id, client_scope_id) FROM stdin;
8f7961a0-5bb7-4436-bc58-fbbbe70413e3	audience resolve	openid-connect	oidc-audience-resolve-mapper	5310f114-a195-4a7e-baa7-b097f62d911a	\N
5327e79d-4ba3-41f2-acbb-737764b39153	locale	openid-connect	oidc-usermodel-attribute-mapper	3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	\N
8cf6645c-d3f6-4adb-8f4d-d3af1bcab7e6	role list	saml	saml-role-list-mapper	\N	0561e09b-0776-4650-80c0-b4769a02d63a
d912b708-77f5-4f30-8c9a-a1fd03a9093c	full name	openid-connect	oidc-full-name-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
31fafa38-0d78-447f-a73e-0c7998a4a3e7	family name	openid-connect	oidc-usermodel-property-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
eac7c10d-de78-47ff-bba5-68e638b079c6	given name	openid-connect	oidc-usermodel-property-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
696c934b-a219-4cde-bbf9-1a09c6eedb26	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
2b21c04b-37d6-4bf8-be1d-f415b911b89b	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
c576e4cf-6872-4b68-8474-5497b6ce14d9	username	openid-connect	oidc-usermodel-property-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
038e2c43-8c9d-46bb-abeb-88ea19b8cba6	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
0abb14fc-2b0f-483f-9b08-cdd47f63d656	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
659ded48-2a6d-404e-bf13-d6a6a3cc1992	website	openid-connect	oidc-usermodel-attribute-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
ca30526d-2fca-454e-8058-479a8f257b15	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
d17cb0df-4f72-4227-8b77-07f5e4b2d05b	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
15b2dcef-1482-4e58-a696-d05135588dc4	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
48b91966-a499-4251-9a45-380a7c78f3a3	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
b87dc2da-b202-4309-b6b2-7354734b40fa	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	0410aa29-458c-418d-9097-b54e3f68460c
8ebef0ca-5ae1-4beb-b802-922f3f607650	email	openid-connect	oidc-usermodel-property-mapper	\N	af32fa91-fd8a-4142-9a2f-cd5e04c61f61
c3ec12b9-736b-43eb-bde5-97acacfcd946	email verified	openid-connect	oidc-usermodel-property-mapper	\N	af32fa91-fd8a-4142-9a2f-cd5e04c61f61
0db0a34b-46a5-401f-8678-8fa048812680	address	openid-connect	oidc-address-mapper	\N	f9711ac9-2c44-4d0d-a281-926d355c19af
3dd62490-ed05-4ded-9dde-c0d888ea9296	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	5a83a323-4899-4241-a0cd-5f555dec2719
4defe373-c7df-4dcb-a4d5-b85c5be9a55c	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	5a83a323-4899-4241-a0cd-5f555dec2719
f2eb9a7c-f1c0-491f-bc05-521abbfeebda	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	618562ba-a542-447e-8b16-68351e2ee465
dcea8e7d-23bc-43dc-9e23-1b3f9ea9f0c4	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	618562ba-a542-447e-8b16-68351e2ee465
dc540f29-e308-48ab-9c9c-5dc1fdea15e1	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	618562ba-a542-447e-8b16-68351e2ee465
4e0d0961-b4ba-42ab-8295-bb9d47924527	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	9543b9a7-54ab-45bc-b657-8bb53604d2ff
8e1aafbd-e877-42ee-ba9e-b8f4e153a2af	upn	openid-connect	oidc-usermodel-property-mapper	\N	b45bda6d-0232-4354-909e-6bb095ed6fca
44ac5445-cb49-46c8-99df-1c8971077d63	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	b45bda6d-0232-4354-909e-6bb095ed6fca
b041cf21-1133-48a7-ac3c-5ea07372bfbc	acr loa level	openid-connect	oidc-acr-mapper	\N	f584b95f-51a7-444e-b77f-0dd99e69a55e
c3f66eb1-d5ca-4e8f-b36b-8c80a68a0a24	audience resolve	openid-connect	oidc-audience-resolve-mapper	f95ce717-e6e3-45da-9312-22644eceb667	\N
f3757b72-ad86-4b35-828b-54eb2809b7ce	role list	saml	saml-role-list-mapper	\N	2323b68d-0c37-414c-af0a-00ba5027d928
d590a3ef-eef2-49fa-b972-3ba3958b0ca3	full name	openid-connect	oidc-full-name-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
60c227a8-c95f-40dc-a916-efd7b2b4fbbe	family name	openid-connect	oidc-usermodel-property-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
3cc9dc2b-8b0a-415b-8e3c-1e5051d2246e	given name	openid-connect	oidc-usermodel-property-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
1ddd7d10-9b64-4f5b-8a76-a5d1ebccce90	middle name	openid-connect	oidc-usermodel-attribute-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
1f5b4637-3bec-403e-a82b-207df665f61f	nickname	openid-connect	oidc-usermodel-attribute-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
90325a54-2602-4937-b2f3-cbd09f8bbb30	username	openid-connect	oidc-usermodel-property-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
70550090-be20-4831-aebd-f8a7672ef64c	profile	openid-connect	oidc-usermodel-attribute-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
477cc005-8974-4be9-9c62-358075a9deb9	picture	openid-connect	oidc-usermodel-attribute-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
078f5cb0-b5e2-4c27-94ea-36bb75370a9d	website	openid-connect	oidc-usermodel-attribute-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
41555fa8-dce2-4064-8f88-c11c5bad935e	gender	openid-connect	oidc-usermodel-attribute-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
85573cbf-aede-4bfc-995f-ef1944d076ed	birthdate	openid-connect	oidc-usermodel-attribute-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
764eca83-14b4-4236-a28f-11a51521eb03	zoneinfo	openid-connect	oidc-usermodel-attribute-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
60398a42-d0e6-4ea5-bcc1-642dd7b9b228	locale	openid-connect	oidc-usermodel-attribute-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
fd4d3ba0-3224-414f-b920-e19f009204b9	updated at	openid-connect	oidc-usermodel-attribute-mapper	\N	7430d820-79aa-4941-9514-b90fb5bf8bda
36d47f0d-64b4-4835-9a77-66b8606eaa87	email	openid-connect	oidc-usermodel-property-mapper	\N	198b19b7-eb14-48a2-a93e-777e550efa0f
697ee5e1-71e0-4243-bbb9-07635913d0ee	email verified	openid-connect	oidc-usermodel-property-mapper	\N	198b19b7-eb14-48a2-a93e-777e550efa0f
9bc5374d-78eb-46cd-828e-21e655901a97	address	openid-connect	oidc-address-mapper	\N	99137542-ae7d-41c9-a837-c0f731719a5b
31734063-4374-4a48-be8b-32aef458a82a	phone number	openid-connect	oidc-usermodel-attribute-mapper	\N	d02d6f13-a231-4baa-abde-d138cb50e380
962c874d-2d5c-4583-b03c-c5acb35558d1	phone number verified	openid-connect	oidc-usermodel-attribute-mapper	\N	d02d6f13-a231-4baa-abde-d138cb50e380
eb2b834b-f207-4bca-8e74-b0034009d68c	realm roles	openid-connect	oidc-usermodel-realm-role-mapper	\N	036b53ee-aa81-48fb-9708-c7a311055ed3
f66a8918-0021-4910-bc9e-794d5968626d	client roles	openid-connect	oidc-usermodel-client-role-mapper	\N	036b53ee-aa81-48fb-9708-c7a311055ed3
013e237e-6d14-4cb3-9f9c-50057ebd1108	audience resolve	openid-connect	oidc-audience-resolve-mapper	\N	036b53ee-aa81-48fb-9708-c7a311055ed3
fa30c4a2-17ed-4e9c-b653-79b637116022	allowed web origins	openid-connect	oidc-allowed-origins-mapper	\N	394978fc-531e-498a-b928-48d65b1fa1a9
0b7b36ce-e4a0-408e-8ee3-f7e3aec6efc5	upn	openid-connect	oidc-usermodel-property-mapper	\N	3897407b-0338-4aec-8402-b81918290d6c
b6f10614-3254-4ff9-8177-2f32053f2602	groups	openid-connect	oidc-usermodel-realm-role-mapper	\N	3897407b-0338-4aec-8402-b81918290d6c
23e6594b-e38f-4c20-80ed-ca09e0dd84d4	acr loa level	openid-connect	oidc-acr-mapper	\N	15c94410-a2f6-4cc8-8a80-21483730906e
b154de66-3769-40f7-bcde-2f24e7480cdc	locale	openid-connect	oidc-usermodel-attribute-mapper	6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	\N
\.


--
-- Data for Name: protocol_mapper_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.protocol_mapper_config (protocol_mapper_id, value, name) FROM stdin;
5327e79d-4ba3-41f2-acbb-737764b39153	true	userinfo.token.claim
5327e79d-4ba3-41f2-acbb-737764b39153	locale	user.attribute
5327e79d-4ba3-41f2-acbb-737764b39153	true	id.token.claim
5327e79d-4ba3-41f2-acbb-737764b39153	true	access.token.claim
5327e79d-4ba3-41f2-acbb-737764b39153	locale	claim.name
5327e79d-4ba3-41f2-acbb-737764b39153	String	jsonType.label
8cf6645c-d3f6-4adb-8f4d-d3af1bcab7e6	false	single
8cf6645c-d3f6-4adb-8f4d-d3af1bcab7e6	Basic	attribute.nameformat
8cf6645c-d3f6-4adb-8f4d-d3af1bcab7e6	Role	attribute.name
038e2c43-8c9d-46bb-abeb-88ea19b8cba6	true	userinfo.token.claim
038e2c43-8c9d-46bb-abeb-88ea19b8cba6	profile	user.attribute
038e2c43-8c9d-46bb-abeb-88ea19b8cba6	true	id.token.claim
038e2c43-8c9d-46bb-abeb-88ea19b8cba6	true	access.token.claim
038e2c43-8c9d-46bb-abeb-88ea19b8cba6	profile	claim.name
038e2c43-8c9d-46bb-abeb-88ea19b8cba6	String	jsonType.label
0abb14fc-2b0f-483f-9b08-cdd47f63d656	true	userinfo.token.claim
0abb14fc-2b0f-483f-9b08-cdd47f63d656	picture	user.attribute
0abb14fc-2b0f-483f-9b08-cdd47f63d656	true	id.token.claim
0abb14fc-2b0f-483f-9b08-cdd47f63d656	true	access.token.claim
0abb14fc-2b0f-483f-9b08-cdd47f63d656	picture	claim.name
0abb14fc-2b0f-483f-9b08-cdd47f63d656	String	jsonType.label
15b2dcef-1482-4e58-a696-d05135588dc4	true	userinfo.token.claim
15b2dcef-1482-4e58-a696-d05135588dc4	zoneinfo	user.attribute
15b2dcef-1482-4e58-a696-d05135588dc4	true	id.token.claim
15b2dcef-1482-4e58-a696-d05135588dc4	true	access.token.claim
15b2dcef-1482-4e58-a696-d05135588dc4	zoneinfo	claim.name
15b2dcef-1482-4e58-a696-d05135588dc4	String	jsonType.label
2b21c04b-37d6-4bf8-be1d-f415b911b89b	true	userinfo.token.claim
2b21c04b-37d6-4bf8-be1d-f415b911b89b	nickname	user.attribute
2b21c04b-37d6-4bf8-be1d-f415b911b89b	true	id.token.claim
2b21c04b-37d6-4bf8-be1d-f415b911b89b	true	access.token.claim
2b21c04b-37d6-4bf8-be1d-f415b911b89b	nickname	claim.name
2b21c04b-37d6-4bf8-be1d-f415b911b89b	String	jsonType.label
31fafa38-0d78-447f-a73e-0c7998a4a3e7	true	userinfo.token.claim
31fafa38-0d78-447f-a73e-0c7998a4a3e7	lastName	user.attribute
31fafa38-0d78-447f-a73e-0c7998a4a3e7	true	id.token.claim
31fafa38-0d78-447f-a73e-0c7998a4a3e7	true	access.token.claim
31fafa38-0d78-447f-a73e-0c7998a4a3e7	family_name	claim.name
31fafa38-0d78-447f-a73e-0c7998a4a3e7	String	jsonType.label
48b91966-a499-4251-9a45-380a7c78f3a3	true	userinfo.token.claim
48b91966-a499-4251-9a45-380a7c78f3a3	locale	user.attribute
48b91966-a499-4251-9a45-380a7c78f3a3	true	id.token.claim
48b91966-a499-4251-9a45-380a7c78f3a3	true	access.token.claim
48b91966-a499-4251-9a45-380a7c78f3a3	locale	claim.name
48b91966-a499-4251-9a45-380a7c78f3a3	String	jsonType.label
659ded48-2a6d-404e-bf13-d6a6a3cc1992	true	userinfo.token.claim
659ded48-2a6d-404e-bf13-d6a6a3cc1992	website	user.attribute
659ded48-2a6d-404e-bf13-d6a6a3cc1992	true	id.token.claim
659ded48-2a6d-404e-bf13-d6a6a3cc1992	true	access.token.claim
659ded48-2a6d-404e-bf13-d6a6a3cc1992	website	claim.name
659ded48-2a6d-404e-bf13-d6a6a3cc1992	String	jsonType.label
696c934b-a219-4cde-bbf9-1a09c6eedb26	true	userinfo.token.claim
696c934b-a219-4cde-bbf9-1a09c6eedb26	middleName	user.attribute
696c934b-a219-4cde-bbf9-1a09c6eedb26	true	id.token.claim
696c934b-a219-4cde-bbf9-1a09c6eedb26	true	access.token.claim
696c934b-a219-4cde-bbf9-1a09c6eedb26	middle_name	claim.name
696c934b-a219-4cde-bbf9-1a09c6eedb26	String	jsonType.label
b87dc2da-b202-4309-b6b2-7354734b40fa	true	userinfo.token.claim
b87dc2da-b202-4309-b6b2-7354734b40fa	updatedAt	user.attribute
b87dc2da-b202-4309-b6b2-7354734b40fa	true	id.token.claim
b87dc2da-b202-4309-b6b2-7354734b40fa	true	access.token.claim
b87dc2da-b202-4309-b6b2-7354734b40fa	updated_at	claim.name
b87dc2da-b202-4309-b6b2-7354734b40fa	long	jsonType.label
c576e4cf-6872-4b68-8474-5497b6ce14d9	true	userinfo.token.claim
c576e4cf-6872-4b68-8474-5497b6ce14d9	username	user.attribute
c576e4cf-6872-4b68-8474-5497b6ce14d9	true	id.token.claim
c576e4cf-6872-4b68-8474-5497b6ce14d9	true	access.token.claim
c576e4cf-6872-4b68-8474-5497b6ce14d9	preferred_username	claim.name
c576e4cf-6872-4b68-8474-5497b6ce14d9	String	jsonType.label
ca30526d-2fca-454e-8058-479a8f257b15	true	userinfo.token.claim
ca30526d-2fca-454e-8058-479a8f257b15	gender	user.attribute
ca30526d-2fca-454e-8058-479a8f257b15	true	id.token.claim
ca30526d-2fca-454e-8058-479a8f257b15	true	access.token.claim
ca30526d-2fca-454e-8058-479a8f257b15	gender	claim.name
ca30526d-2fca-454e-8058-479a8f257b15	String	jsonType.label
d17cb0df-4f72-4227-8b77-07f5e4b2d05b	true	userinfo.token.claim
d17cb0df-4f72-4227-8b77-07f5e4b2d05b	birthdate	user.attribute
d17cb0df-4f72-4227-8b77-07f5e4b2d05b	true	id.token.claim
d17cb0df-4f72-4227-8b77-07f5e4b2d05b	true	access.token.claim
d17cb0df-4f72-4227-8b77-07f5e4b2d05b	birthdate	claim.name
d17cb0df-4f72-4227-8b77-07f5e4b2d05b	String	jsonType.label
d912b708-77f5-4f30-8c9a-a1fd03a9093c	true	userinfo.token.claim
d912b708-77f5-4f30-8c9a-a1fd03a9093c	true	id.token.claim
d912b708-77f5-4f30-8c9a-a1fd03a9093c	true	access.token.claim
eac7c10d-de78-47ff-bba5-68e638b079c6	true	userinfo.token.claim
eac7c10d-de78-47ff-bba5-68e638b079c6	firstName	user.attribute
eac7c10d-de78-47ff-bba5-68e638b079c6	true	id.token.claim
eac7c10d-de78-47ff-bba5-68e638b079c6	true	access.token.claim
eac7c10d-de78-47ff-bba5-68e638b079c6	given_name	claim.name
eac7c10d-de78-47ff-bba5-68e638b079c6	String	jsonType.label
8ebef0ca-5ae1-4beb-b802-922f3f607650	true	userinfo.token.claim
8ebef0ca-5ae1-4beb-b802-922f3f607650	email	user.attribute
8ebef0ca-5ae1-4beb-b802-922f3f607650	true	id.token.claim
8ebef0ca-5ae1-4beb-b802-922f3f607650	true	access.token.claim
8ebef0ca-5ae1-4beb-b802-922f3f607650	email	claim.name
8ebef0ca-5ae1-4beb-b802-922f3f607650	String	jsonType.label
c3ec12b9-736b-43eb-bde5-97acacfcd946	true	userinfo.token.claim
c3ec12b9-736b-43eb-bde5-97acacfcd946	emailVerified	user.attribute
c3ec12b9-736b-43eb-bde5-97acacfcd946	true	id.token.claim
c3ec12b9-736b-43eb-bde5-97acacfcd946	true	access.token.claim
c3ec12b9-736b-43eb-bde5-97acacfcd946	email_verified	claim.name
c3ec12b9-736b-43eb-bde5-97acacfcd946	boolean	jsonType.label
0db0a34b-46a5-401f-8678-8fa048812680	formatted	user.attribute.formatted
0db0a34b-46a5-401f-8678-8fa048812680	country	user.attribute.country
0db0a34b-46a5-401f-8678-8fa048812680	postal_code	user.attribute.postal_code
0db0a34b-46a5-401f-8678-8fa048812680	true	userinfo.token.claim
0db0a34b-46a5-401f-8678-8fa048812680	street	user.attribute.street
0db0a34b-46a5-401f-8678-8fa048812680	true	id.token.claim
0db0a34b-46a5-401f-8678-8fa048812680	region	user.attribute.region
0db0a34b-46a5-401f-8678-8fa048812680	true	access.token.claim
0db0a34b-46a5-401f-8678-8fa048812680	locality	user.attribute.locality
3dd62490-ed05-4ded-9dde-c0d888ea9296	true	userinfo.token.claim
3dd62490-ed05-4ded-9dde-c0d888ea9296	phoneNumber	user.attribute
3dd62490-ed05-4ded-9dde-c0d888ea9296	true	id.token.claim
3dd62490-ed05-4ded-9dde-c0d888ea9296	true	access.token.claim
3dd62490-ed05-4ded-9dde-c0d888ea9296	phone_number	claim.name
3dd62490-ed05-4ded-9dde-c0d888ea9296	String	jsonType.label
4defe373-c7df-4dcb-a4d5-b85c5be9a55c	true	userinfo.token.claim
4defe373-c7df-4dcb-a4d5-b85c5be9a55c	phoneNumberVerified	user.attribute
4defe373-c7df-4dcb-a4d5-b85c5be9a55c	true	id.token.claim
4defe373-c7df-4dcb-a4d5-b85c5be9a55c	true	access.token.claim
4defe373-c7df-4dcb-a4d5-b85c5be9a55c	phone_number_verified	claim.name
4defe373-c7df-4dcb-a4d5-b85c5be9a55c	boolean	jsonType.label
dcea8e7d-23bc-43dc-9e23-1b3f9ea9f0c4	true	multivalued
dcea8e7d-23bc-43dc-9e23-1b3f9ea9f0c4	foo	user.attribute
dcea8e7d-23bc-43dc-9e23-1b3f9ea9f0c4	true	access.token.claim
dcea8e7d-23bc-43dc-9e23-1b3f9ea9f0c4	resource_access.${client_id}.roles	claim.name
dcea8e7d-23bc-43dc-9e23-1b3f9ea9f0c4	String	jsonType.label
f2eb9a7c-f1c0-491f-bc05-521abbfeebda	true	multivalued
f2eb9a7c-f1c0-491f-bc05-521abbfeebda	foo	user.attribute
f2eb9a7c-f1c0-491f-bc05-521abbfeebda	true	access.token.claim
f2eb9a7c-f1c0-491f-bc05-521abbfeebda	realm_access.roles	claim.name
f2eb9a7c-f1c0-491f-bc05-521abbfeebda	String	jsonType.label
44ac5445-cb49-46c8-99df-1c8971077d63	true	multivalued
44ac5445-cb49-46c8-99df-1c8971077d63	foo	user.attribute
44ac5445-cb49-46c8-99df-1c8971077d63	true	id.token.claim
44ac5445-cb49-46c8-99df-1c8971077d63	true	access.token.claim
44ac5445-cb49-46c8-99df-1c8971077d63	groups	claim.name
44ac5445-cb49-46c8-99df-1c8971077d63	String	jsonType.label
8e1aafbd-e877-42ee-ba9e-b8f4e153a2af	true	userinfo.token.claim
8e1aafbd-e877-42ee-ba9e-b8f4e153a2af	username	user.attribute
8e1aafbd-e877-42ee-ba9e-b8f4e153a2af	true	id.token.claim
8e1aafbd-e877-42ee-ba9e-b8f4e153a2af	true	access.token.claim
8e1aafbd-e877-42ee-ba9e-b8f4e153a2af	upn	claim.name
8e1aafbd-e877-42ee-ba9e-b8f4e153a2af	String	jsonType.label
b041cf21-1133-48a7-ac3c-5ea07372bfbc	true	id.token.claim
b041cf21-1133-48a7-ac3c-5ea07372bfbc	true	access.token.claim
f3757b72-ad86-4b35-828b-54eb2809b7ce	false	single
f3757b72-ad86-4b35-828b-54eb2809b7ce	Basic	attribute.nameformat
f3757b72-ad86-4b35-828b-54eb2809b7ce	Role	attribute.name
078f5cb0-b5e2-4c27-94ea-36bb75370a9d	true	userinfo.token.claim
078f5cb0-b5e2-4c27-94ea-36bb75370a9d	website	user.attribute
078f5cb0-b5e2-4c27-94ea-36bb75370a9d	true	id.token.claim
078f5cb0-b5e2-4c27-94ea-36bb75370a9d	true	access.token.claim
078f5cb0-b5e2-4c27-94ea-36bb75370a9d	website	claim.name
078f5cb0-b5e2-4c27-94ea-36bb75370a9d	String	jsonType.label
1ddd7d10-9b64-4f5b-8a76-a5d1ebccce90	true	userinfo.token.claim
1ddd7d10-9b64-4f5b-8a76-a5d1ebccce90	middleName	user.attribute
1ddd7d10-9b64-4f5b-8a76-a5d1ebccce90	true	id.token.claim
1ddd7d10-9b64-4f5b-8a76-a5d1ebccce90	true	access.token.claim
1ddd7d10-9b64-4f5b-8a76-a5d1ebccce90	middle_name	claim.name
1ddd7d10-9b64-4f5b-8a76-a5d1ebccce90	String	jsonType.label
1f5b4637-3bec-403e-a82b-207df665f61f	true	userinfo.token.claim
1f5b4637-3bec-403e-a82b-207df665f61f	nickname	user.attribute
1f5b4637-3bec-403e-a82b-207df665f61f	true	id.token.claim
1f5b4637-3bec-403e-a82b-207df665f61f	true	access.token.claim
1f5b4637-3bec-403e-a82b-207df665f61f	nickname	claim.name
1f5b4637-3bec-403e-a82b-207df665f61f	String	jsonType.label
3cc9dc2b-8b0a-415b-8e3c-1e5051d2246e	true	userinfo.token.claim
3cc9dc2b-8b0a-415b-8e3c-1e5051d2246e	firstName	user.attribute
3cc9dc2b-8b0a-415b-8e3c-1e5051d2246e	true	id.token.claim
3cc9dc2b-8b0a-415b-8e3c-1e5051d2246e	true	access.token.claim
3cc9dc2b-8b0a-415b-8e3c-1e5051d2246e	given_name	claim.name
3cc9dc2b-8b0a-415b-8e3c-1e5051d2246e	String	jsonType.label
41555fa8-dce2-4064-8f88-c11c5bad935e	true	userinfo.token.claim
41555fa8-dce2-4064-8f88-c11c5bad935e	gender	user.attribute
41555fa8-dce2-4064-8f88-c11c5bad935e	true	id.token.claim
41555fa8-dce2-4064-8f88-c11c5bad935e	true	access.token.claim
41555fa8-dce2-4064-8f88-c11c5bad935e	gender	claim.name
41555fa8-dce2-4064-8f88-c11c5bad935e	String	jsonType.label
477cc005-8974-4be9-9c62-358075a9deb9	true	userinfo.token.claim
477cc005-8974-4be9-9c62-358075a9deb9	picture	user.attribute
477cc005-8974-4be9-9c62-358075a9deb9	true	id.token.claim
477cc005-8974-4be9-9c62-358075a9deb9	true	access.token.claim
477cc005-8974-4be9-9c62-358075a9deb9	picture	claim.name
477cc005-8974-4be9-9c62-358075a9deb9	String	jsonType.label
60398a42-d0e6-4ea5-bcc1-642dd7b9b228	true	userinfo.token.claim
60398a42-d0e6-4ea5-bcc1-642dd7b9b228	locale	user.attribute
60398a42-d0e6-4ea5-bcc1-642dd7b9b228	true	id.token.claim
60398a42-d0e6-4ea5-bcc1-642dd7b9b228	true	access.token.claim
60398a42-d0e6-4ea5-bcc1-642dd7b9b228	locale	claim.name
60398a42-d0e6-4ea5-bcc1-642dd7b9b228	String	jsonType.label
60c227a8-c95f-40dc-a916-efd7b2b4fbbe	true	userinfo.token.claim
60c227a8-c95f-40dc-a916-efd7b2b4fbbe	lastName	user.attribute
60c227a8-c95f-40dc-a916-efd7b2b4fbbe	true	id.token.claim
60c227a8-c95f-40dc-a916-efd7b2b4fbbe	true	access.token.claim
60c227a8-c95f-40dc-a916-efd7b2b4fbbe	family_name	claim.name
60c227a8-c95f-40dc-a916-efd7b2b4fbbe	String	jsonType.label
70550090-be20-4831-aebd-f8a7672ef64c	true	userinfo.token.claim
70550090-be20-4831-aebd-f8a7672ef64c	profile	user.attribute
70550090-be20-4831-aebd-f8a7672ef64c	true	id.token.claim
70550090-be20-4831-aebd-f8a7672ef64c	true	access.token.claim
70550090-be20-4831-aebd-f8a7672ef64c	profile	claim.name
70550090-be20-4831-aebd-f8a7672ef64c	String	jsonType.label
764eca83-14b4-4236-a28f-11a51521eb03	true	userinfo.token.claim
764eca83-14b4-4236-a28f-11a51521eb03	zoneinfo	user.attribute
764eca83-14b4-4236-a28f-11a51521eb03	true	id.token.claim
764eca83-14b4-4236-a28f-11a51521eb03	true	access.token.claim
764eca83-14b4-4236-a28f-11a51521eb03	zoneinfo	claim.name
764eca83-14b4-4236-a28f-11a51521eb03	String	jsonType.label
85573cbf-aede-4bfc-995f-ef1944d076ed	true	userinfo.token.claim
85573cbf-aede-4bfc-995f-ef1944d076ed	birthdate	user.attribute
85573cbf-aede-4bfc-995f-ef1944d076ed	true	id.token.claim
85573cbf-aede-4bfc-995f-ef1944d076ed	true	access.token.claim
85573cbf-aede-4bfc-995f-ef1944d076ed	birthdate	claim.name
85573cbf-aede-4bfc-995f-ef1944d076ed	String	jsonType.label
90325a54-2602-4937-b2f3-cbd09f8bbb30	true	userinfo.token.claim
90325a54-2602-4937-b2f3-cbd09f8bbb30	username	user.attribute
90325a54-2602-4937-b2f3-cbd09f8bbb30	true	id.token.claim
90325a54-2602-4937-b2f3-cbd09f8bbb30	true	access.token.claim
90325a54-2602-4937-b2f3-cbd09f8bbb30	preferred_username	claim.name
90325a54-2602-4937-b2f3-cbd09f8bbb30	String	jsonType.label
d590a3ef-eef2-49fa-b972-3ba3958b0ca3	true	userinfo.token.claim
d590a3ef-eef2-49fa-b972-3ba3958b0ca3	true	id.token.claim
d590a3ef-eef2-49fa-b972-3ba3958b0ca3	true	access.token.claim
fd4d3ba0-3224-414f-b920-e19f009204b9	true	userinfo.token.claim
fd4d3ba0-3224-414f-b920-e19f009204b9	updatedAt	user.attribute
fd4d3ba0-3224-414f-b920-e19f009204b9	true	id.token.claim
fd4d3ba0-3224-414f-b920-e19f009204b9	true	access.token.claim
fd4d3ba0-3224-414f-b920-e19f009204b9	updated_at	claim.name
fd4d3ba0-3224-414f-b920-e19f009204b9	long	jsonType.label
36d47f0d-64b4-4835-9a77-66b8606eaa87	true	userinfo.token.claim
36d47f0d-64b4-4835-9a77-66b8606eaa87	email	user.attribute
36d47f0d-64b4-4835-9a77-66b8606eaa87	true	id.token.claim
36d47f0d-64b4-4835-9a77-66b8606eaa87	true	access.token.claim
36d47f0d-64b4-4835-9a77-66b8606eaa87	email	claim.name
36d47f0d-64b4-4835-9a77-66b8606eaa87	String	jsonType.label
697ee5e1-71e0-4243-bbb9-07635913d0ee	true	userinfo.token.claim
697ee5e1-71e0-4243-bbb9-07635913d0ee	emailVerified	user.attribute
697ee5e1-71e0-4243-bbb9-07635913d0ee	true	id.token.claim
697ee5e1-71e0-4243-bbb9-07635913d0ee	true	access.token.claim
697ee5e1-71e0-4243-bbb9-07635913d0ee	email_verified	claim.name
697ee5e1-71e0-4243-bbb9-07635913d0ee	boolean	jsonType.label
9bc5374d-78eb-46cd-828e-21e655901a97	formatted	user.attribute.formatted
9bc5374d-78eb-46cd-828e-21e655901a97	country	user.attribute.country
9bc5374d-78eb-46cd-828e-21e655901a97	postal_code	user.attribute.postal_code
9bc5374d-78eb-46cd-828e-21e655901a97	true	userinfo.token.claim
9bc5374d-78eb-46cd-828e-21e655901a97	street	user.attribute.street
9bc5374d-78eb-46cd-828e-21e655901a97	true	id.token.claim
9bc5374d-78eb-46cd-828e-21e655901a97	region	user.attribute.region
9bc5374d-78eb-46cd-828e-21e655901a97	true	access.token.claim
9bc5374d-78eb-46cd-828e-21e655901a97	locality	user.attribute.locality
31734063-4374-4a48-be8b-32aef458a82a	true	userinfo.token.claim
31734063-4374-4a48-be8b-32aef458a82a	phoneNumber	user.attribute
31734063-4374-4a48-be8b-32aef458a82a	true	id.token.claim
31734063-4374-4a48-be8b-32aef458a82a	true	access.token.claim
31734063-4374-4a48-be8b-32aef458a82a	phone_number	claim.name
31734063-4374-4a48-be8b-32aef458a82a	String	jsonType.label
962c874d-2d5c-4583-b03c-c5acb35558d1	true	userinfo.token.claim
962c874d-2d5c-4583-b03c-c5acb35558d1	phoneNumberVerified	user.attribute
962c874d-2d5c-4583-b03c-c5acb35558d1	true	id.token.claim
962c874d-2d5c-4583-b03c-c5acb35558d1	true	access.token.claim
962c874d-2d5c-4583-b03c-c5acb35558d1	phone_number_verified	claim.name
962c874d-2d5c-4583-b03c-c5acb35558d1	boolean	jsonType.label
eb2b834b-f207-4bca-8e74-b0034009d68c	true	multivalued
eb2b834b-f207-4bca-8e74-b0034009d68c	foo	user.attribute
eb2b834b-f207-4bca-8e74-b0034009d68c	true	access.token.claim
eb2b834b-f207-4bca-8e74-b0034009d68c	realm_access.roles	claim.name
eb2b834b-f207-4bca-8e74-b0034009d68c	String	jsonType.label
f66a8918-0021-4910-bc9e-794d5968626d	true	multivalued
f66a8918-0021-4910-bc9e-794d5968626d	foo	user.attribute
f66a8918-0021-4910-bc9e-794d5968626d	true	access.token.claim
f66a8918-0021-4910-bc9e-794d5968626d	resource_access.${client_id}.roles	claim.name
f66a8918-0021-4910-bc9e-794d5968626d	String	jsonType.label
0b7b36ce-e4a0-408e-8ee3-f7e3aec6efc5	true	userinfo.token.claim
0b7b36ce-e4a0-408e-8ee3-f7e3aec6efc5	username	user.attribute
0b7b36ce-e4a0-408e-8ee3-f7e3aec6efc5	true	id.token.claim
0b7b36ce-e4a0-408e-8ee3-f7e3aec6efc5	true	access.token.claim
0b7b36ce-e4a0-408e-8ee3-f7e3aec6efc5	upn	claim.name
0b7b36ce-e4a0-408e-8ee3-f7e3aec6efc5	String	jsonType.label
b6f10614-3254-4ff9-8177-2f32053f2602	true	multivalued
b6f10614-3254-4ff9-8177-2f32053f2602	foo	user.attribute
b6f10614-3254-4ff9-8177-2f32053f2602	true	id.token.claim
b6f10614-3254-4ff9-8177-2f32053f2602	true	access.token.claim
b6f10614-3254-4ff9-8177-2f32053f2602	groups	claim.name
b6f10614-3254-4ff9-8177-2f32053f2602	String	jsonType.label
23e6594b-e38f-4c20-80ed-ca09e0dd84d4	true	id.token.claim
23e6594b-e38f-4c20-80ed-ca09e0dd84d4	true	access.token.claim
b154de66-3769-40f7-bcde-2f24e7480cdc	true	userinfo.token.claim
b154de66-3769-40f7-bcde-2f24e7480cdc	locale	user.attribute
b154de66-3769-40f7-bcde-2f24e7480cdc	true	id.token.claim
b154de66-3769-40f7-bcde-2f24e7480cdc	true	access.token.claim
b154de66-3769-40f7-bcde-2f24e7480cdc	locale	claim.name
b154de66-3769-40f7-bcde-2f24e7480cdc	String	jsonType.label
\.


--
-- Data for Name: realm; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm (id, access_code_lifespan, user_action_lifespan, access_token_lifespan, account_theme, admin_theme, email_theme, enabled, events_enabled, events_expiration, login_theme, name, not_before, password_policy, registration_allowed, remember_me, reset_password_allowed, social, ssl_required, sso_idle_timeout, sso_max_lifespan, update_profile_on_soc_login, verify_email, master_admin_client, login_lifespan, internationalization_enabled, default_locale, reg_email_as_username, admin_events_enabled, admin_events_details_enabled, edit_username_allowed, otp_policy_counter, otp_policy_window, otp_policy_period, otp_policy_digits, otp_policy_alg, otp_policy_type, browser_flow, registration_flow, direct_grant_flow, reset_credentials_flow, client_auth_flow, offline_session_idle_timeout, revoke_refresh_token, access_token_life_implicit, login_with_email_allowed, duplicate_emails_allowed, docker_auth_flow, refresh_token_max_reuse, allow_user_managed_access, sso_max_lifespan_remember_me, sso_idle_timeout_remember_me, default_role) FROM stdin;
94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	60	300	300				t	f	0	mainzelliste	mainzelliste	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	d9029962-3755-499d-9a33-f672bb030535	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	e2279fbd-5be9-49b6-b9dd-55a0efaf0885	99971b15-950c-44e8-854c-14bbed884480	715f3241-6ab6-4b2d-acb9-bcb3a6736c83	b007571d-788f-470f-98b7-d095b433cf62	a2df0055-044c-41da-807b-fac4fe3c3ecc	2592000	f	900	t	f	cf26b88f-1a2c-423a-81fc-34399a6aeff3	0	f	0	0	3c5557bf-bc46-435b-b45f-3e0a6e983f6c
cb657751-60e1-4583-91be-f6ae0b5826d5	60	300	60	\N	\N	\N	t	f	0	\N	master	0	\N	f	f	f	f	EXTERNAL	1800	36000	f	f	7018dd8d-2b35-442e-b684-e295c562db46	1800	f	\N	f	f	f	f	0	1	30	6	HmacSHA1	totp	824d98d0-6257-4642-9cc1-27521295820b	b829f8ea-4a30-4fda-9ea7-a64e0a9e350b	ec3cc918-98ca-4c7c-b324-6894cf211658	e41759a2-254d-4713-b3e9-c9e57a04014d	3c8980f4-b1cc-415e-be90-9acf10d88247	2592000	f	900	t	f	044a8483-d9a9-4c24-adb3-a1fd2093ef1b	0	f	0	0	49b640bc-5d04-4fe2-9972-ebb298f894ab
\.


--
-- Data for Name: realm_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_attribute (name, realm_id, value) FROM stdin;
_browser_header.contentSecurityPolicyReportOnly	cb657751-60e1-4583-91be-f6ae0b5826d5
_browser_header.xContentTypeOptions	cb657751-60e1-4583-91be-f6ae0b5826d5	nosniff
_browser_header.xRobotsTag	cb657751-60e1-4583-91be-f6ae0b5826d5	none
_browser_header.xFrameOptions	cb657751-60e1-4583-91be-f6ae0b5826d5	SAMEORIGIN
_browser_header.contentSecurityPolicy	cb657751-60e1-4583-91be-f6ae0b5826d5	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.xXSSProtection	cb657751-60e1-4583-91be-f6ae0b5826d5	1; mode=block
_browser_header.strictTransportSecurity	cb657751-60e1-4583-91be-f6ae0b5826d5	max-age=31536000; includeSubDomains
bruteForceProtected	cb657751-60e1-4583-91be-f6ae0b5826d5	false
permanentLockout	cb657751-60e1-4583-91be-f6ae0b5826d5	false
maxFailureWaitSeconds	cb657751-60e1-4583-91be-f6ae0b5826d5	900
minimumQuickLoginWaitSeconds	cb657751-60e1-4583-91be-f6ae0b5826d5	60
waitIncrementSeconds	cb657751-60e1-4583-91be-f6ae0b5826d5	60
quickLoginCheckMilliSeconds	cb657751-60e1-4583-91be-f6ae0b5826d5	1000
maxDeltaTimeSeconds	cb657751-60e1-4583-91be-f6ae0b5826d5	43200
failureFactor	cb657751-60e1-4583-91be-f6ae0b5826d5	30
realmReusableOtpCode	cb657751-60e1-4583-91be-f6ae0b5826d5	false
displayName	cb657751-60e1-4583-91be-f6ae0b5826d5	Keycloak
displayNameHtml	cb657751-60e1-4583-91be-f6ae0b5826d5	<div class="kc-logo-text"><span>Keycloak</span></div>
defaultSignatureAlgorithm	cb657751-60e1-4583-91be-f6ae0b5826d5	RS256
offlineSessionMaxLifespanEnabled	cb657751-60e1-4583-91be-f6ae0b5826d5	false
offlineSessionMaxLifespan	cb657751-60e1-4583-91be-f6ae0b5826d5	5184000
displayName	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf
displayNameHtml	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	<div class="kc-logo-text"><span></span></div>
bruteForceProtected	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	false
permanentLockout	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	false
maxFailureWaitSeconds	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	900
minimumQuickLoginWaitSeconds	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	60
waitIncrementSeconds	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	60
quickLoginCheckMilliSeconds	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	1000
maxDeltaTimeSeconds	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	43200
failureFactor	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	30
actionTokenGeneratedByAdminLifespan	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	43200
actionTokenGeneratedByUserLifespan	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	300
defaultSignatureAlgorithm	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	RS256
offlineSessionMaxLifespanEnabled	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	false
offlineSessionMaxLifespan	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	5184000
realmReusableOtpCode	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	false
webAuthnPolicyRpEntityName	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	keycloak
webAuthnPolicySignatureAlgorithms	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	ES256
webAuthnPolicyRpId	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf
webAuthnPolicyAttestationConveyancePreference	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	not specified
webAuthnPolicyAuthenticatorAttachment	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	not specified
oauth2DeviceCodeLifespan	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	600
oauth2DevicePollingInterval	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	5
webAuthnPolicyRequireResidentKey	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	not specified
webAuthnPolicyUserVerificationRequirement	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	not specified
webAuthnPolicyCreateTimeout	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	0
webAuthnPolicyAvoidSameAuthenticatorRegister	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	false
webAuthnPolicyRpEntityNamePasswordless	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	keycloak
webAuthnPolicySignatureAlgorithmsPasswordless	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	ES256
webAuthnPolicyRpIdPasswordless	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf
webAuthnPolicyAttestationConveyancePreferencePasswordless	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	not specified
webAuthnPolicyAuthenticatorAttachmentPasswordless	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	not specified
webAuthnPolicyRequireResidentKeyPasswordless	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	not specified
webAuthnPolicyUserVerificationRequirementPasswordless	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	not specified
webAuthnPolicyCreateTimeoutPasswordless	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	0
webAuthnPolicyAvoidSameAuthenticatorRegisterPasswordless	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	false
client-policies.profiles	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	{"profiles":[]}
client-policies.policies	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	{"policies":[]}
_browser_header.contentSecurityPolicyReportOnly	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf
_browser_header.xContentTypeOptions	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	nosniff
_browser_header.xRobotsTag	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	none
cibaBackchannelTokenDeliveryMode	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	poll
cibaExpiresIn	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	120
cibaInterval	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	5
cibaAuthRequestedUserHint	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	login_hint
parRequestUriLifespan	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	60
acr.loa.map	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	{}
frontendUrl	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf
_browser_header.xFrameOptions	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	SAMEORIGIN
_browser_header.contentSecurityPolicy	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	frame-src 'self'; frame-ancestors 'self'; object-src 'none';
_browser_header.xXSSProtection	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	1; mode=block
_browser_header.strictTransportSecurity	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	max-age=31536000; includeSubDomains
clientSessionIdleTimeout	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	0
clientSessionMaxLifespan	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	0
clientOfflineSessionIdleTimeout	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	0
clientOfflineSessionMaxLifespan	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	0
\.


--
-- Data for Name: realm_default_groups; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_default_groups (realm_id, group_id) FROM stdin;
\.


--
-- Data for Name: realm_enabled_event_types; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_enabled_event_types (realm_id, value) FROM stdin;
\.


--
-- Data for Name: realm_events_listeners; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_events_listeners (realm_id, value) FROM stdin;
cb657751-60e1-4583-91be-f6ae0b5826d5	jboss-logging
94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	jboss-logging
\.


--
-- Data for Name: realm_localizations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_localizations (realm_id, locale, texts) FROM stdin;
\.


--
-- Data for Name: realm_required_credential; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_required_credential (type, form_label, input, secret, realm_id) FROM stdin;
password	password	t	t	cb657751-60e1-4583-91be-f6ae0b5826d5
password	password	t	t	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf
\.


--
-- Data for Name: realm_smtp_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_smtp_config (realm_id, value, name) FROM stdin;
\.


--
-- Data for Name: realm_supported_locales; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.realm_supported_locales (realm_id, value) FROM stdin;
\.


--
-- Data for Name: redirect_uris; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.redirect_uris (client_id, value) FROM stdin;
410044cd-6864-4906-ae80-06d3ff41ebc9	/realms/master/account/*
5310f114-a195-4a7e-baa7-b097f62d911a	/realms/master/account/*
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	/admin/master/console/*
2ef8ef9a-6b19-45db-99ba-819589ddda1e	/realms/mainzelliste/account/*
f95ce717-e6e3-45da-9312-22644eceb667	/realms/mainzelliste/account/*
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	/admin/mainzelliste/console/*
28e7349b-8356-490d-8630-bd9aad26f316	http://localhost/*
\.


--
-- Data for Name: required_action_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.required_action_config (required_action_id, value, name) FROM stdin;
\.


--
-- Data for Name: required_action_provider; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.required_action_provider (id, alias, name, realm_id, enabled, default_action, provider_id, priority) FROM stdin;
69d6783f-2d8c-453d-b40b-f098a37b2e29	VERIFY_EMAIL	Verify Email	cb657751-60e1-4583-91be-f6ae0b5826d5	t	f	VERIFY_EMAIL	50
37388f15-0560-41e9-a814-04b6eebdc840	UPDATE_PROFILE	Update Profile	cb657751-60e1-4583-91be-f6ae0b5826d5	t	f	UPDATE_PROFILE	40
dcd88630-6bf3-47e7-a793-b529007baa5c	CONFIGURE_TOTP	Configure OTP	cb657751-60e1-4583-91be-f6ae0b5826d5	t	f	CONFIGURE_TOTP	10
b32733b4-0129-4614-bf74-afee323baeb8	UPDATE_PASSWORD	Update Password	cb657751-60e1-4583-91be-f6ae0b5826d5	t	f	UPDATE_PASSWORD	30
f8c21637-fe9c-4406-9b44-b660471e1987	terms_and_conditions	Terms and Conditions	cb657751-60e1-4583-91be-f6ae0b5826d5	f	f	terms_and_conditions	20
fdd74f9a-949b-42c1-8d08-4e68e89433cf	delete_account	Delete Account	cb657751-60e1-4583-91be-f6ae0b5826d5	f	f	delete_account	60
ea97756d-d038-48a3-bcca-ea24dc01492a	update_user_locale	Update User Locale	cb657751-60e1-4583-91be-f6ae0b5826d5	t	f	update_user_locale	1000
f16da0ae-0e3f-47c2-8c84-f1d3ca30e61a	webauthn-register	Webauthn Register	cb657751-60e1-4583-91be-f6ae0b5826d5	t	f	webauthn-register	70
2f347b6f-6609-4d00-b167-c97338fd769b	webauthn-register-passwordless	Webauthn Register Passwordless	cb657751-60e1-4583-91be-f6ae0b5826d5	t	f	webauthn-register-passwordless	80
735ffd73-823c-4038-baa6-5bb2234101a0	VERIFY_EMAIL	Verify Email	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	t	f	VERIFY_EMAIL	50
3bac0da8-3469-424f-8ae9-66fcb94f1341	UPDATE_PROFILE	Update Profile	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	t	f	UPDATE_PROFILE	40
635de2da-d6ca-43d0-b241-82a2c43ac633	CONFIGURE_TOTP	Configure OTP	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	t	f	CONFIGURE_TOTP	10
c7161fe3-7e1a-4735-943e-3a9faf2001ec	UPDATE_PASSWORD	Update Password	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	t	f	UPDATE_PASSWORD	30
8b7dfee2-429f-486b-8df5-3b3764841d36	terms_and_conditions	Terms and Conditions	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	f	f	terms_and_conditions	20
0c8f85ca-01a1-4c8f-995e-ea1635cba6d0	delete_account	Delete Account	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	f	f	delete_account	60
8a4a45cd-60d1-41e2-bd9d-e81ef0f18d7d	update_user_locale	Update User Locale	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	t	f	update_user_locale	1000
9847011c-fd82-4d25-a7a1-aaa15762c80d	webauthn-register	Webauthn Register	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	t	f	webauthn-register	70
7ea7f2c6-3272-407d-a012-a18af1244ad2	webauthn-register-passwordless	Webauthn Register Passwordless	94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	t	f	webauthn-register-passwordless	80
\.


--
-- Data for Name: resource_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_attribute (id, name, value, resource_id) FROM stdin;
\.


--
-- Data for Name: resource_policy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_policy (resource_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_scope (resource_id, scope_id) FROM stdin;
\.


--
-- Data for Name: resource_server; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server (id, allow_rs_remote_mgmt, policy_enforce_mode, decision_strategy) FROM stdin;
\.


--
-- Data for Name: resource_server_perm_ticket; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server_perm_ticket (id, owner, requester, created_timestamp, granted_timestamp, resource_id, scope_id, resource_server_id, policy_id) FROM stdin;
\.


--
-- Data for Name: resource_server_policy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server_policy (id, name, description, type, decision_strategy, logic, resource_server_id, owner) FROM stdin;
\.


--
-- Data for Name: resource_server_resource; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server_resource (id, name, type, icon_uri, owner, resource_server_id, owner_managed_access, display_name) FROM stdin;
\.


--
-- Data for Name: resource_server_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_server_scope (id, name, icon_uri, resource_server_id, display_name) FROM stdin;
\.


--
-- Data for Name: resource_uris; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_uris (resource_id, value) FROM stdin;
\.


--
-- Data for Name: role_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.role_attribute (id, role_id, name, value) FROM stdin;
\.


--
-- Data for Name: scope_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.scope_mapping (client_id, role_id) FROM stdin;
5310f114-a195-4a7e-baa7-b097f62d911a	1bfd72c8-c9a2-4140-9375-e8116ec5aff5
5310f114-a195-4a7e-baa7-b097f62d911a	77572be2-192f-45e0-a58d-99d421261613
f95ce717-e6e3-45da-9312-22644eceb667	3abd0b3d-00dc-49e7-8f10-bb245a49616a
f95ce717-e6e3-45da-9312-22644eceb667	46e47833-fcd0-44d8-8436-d4ad5d8bc37e
\.


--
-- Data for Name: scope_policy; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.scope_policy (scope_id, policy_id) FROM stdin;
\.


--
-- Data for Name: user_attribute; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_attribute (name, value, user_id, id) FROM stdin;
\.


--
-- Data for Name: user_consent; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_consent (id, client_id, user_id, created_date, last_updated_date, client_storage_provider, external_client_id) FROM stdin;
\.


--
-- Data for Name: user_consent_client_scope; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_consent_client_scope (user_consent_id, scope_id) FROM stdin;
\.


--
-- Data for Name: user_entity; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_entity (id, email, email_constraint, email_verified, enabled, federation_link, first_name, last_name, realm_id, username, created_timestamp, service_account_client_link, not_before) FROM stdin;
7bda9e08-19dd-4e32-9785-619fd68cab05	\N	e1caafbb-f8c9-454d-a56f-6557fca823ac	f	t	\N	\N	\N	cb657751-60e1-4583-91be-f6ae0b5826d5	admin	1693815001077	\N	0
7d6df4ce-cfdd-4b44-a653-628e6f4cd042	\N	f889ffe4-44dd-46ab-ab6b-dd2e2f8bebb8	f	t	\N			94ce22c3-7f74-4f86-84eb-d1d89d0e0ddf	demo	1693815851865	\N	0
\.


--
-- Data for Name: user_federation_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_federation_config (user_federation_provider_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_federation_mapper (id, name, federation_provider_id, federation_mapper_type, realm_id) FROM stdin;
\.


--
-- Data for Name: user_federation_mapper_config; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_federation_mapper_config (user_federation_mapper_id, value, name) FROM stdin;
\.


--
-- Data for Name: user_federation_provider; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_federation_provider (id, changed_sync_period, display_name, full_sync_period, last_sync, priority, provider_name, realm_id) FROM stdin;
\.


--
-- Data for Name: user_group_membership; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_group_membership (group_id, user_id) FROM stdin;
\.


--
-- Data for Name: user_required_action; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_required_action (user_id, required_action) FROM stdin;
\.


--
-- Data for Name: user_role_mapping; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_role_mapping (role_id, user_id) FROM stdin;
49b640bc-5d04-4fe2-9972-ebb298f894ab	7bda9e08-19dd-4e32-9785-619fd68cab05
e305431f-179a-4ca2-8858-355f4f89e86a	7bda9e08-19dd-4e32-9785-619fd68cab05
80f2d71a-c475-4b60-a74e-3358617f5a32	7bda9e08-19dd-4e32-9785-619fd68cab05
2c205fd0-6c2a-4af6-8319-1e6e4c2a6663	7bda9e08-19dd-4e32-9785-619fd68cab05
2fe923ae-1a93-4e0e-b2f2-75451bd42a40	7bda9e08-19dd-4e32-9785-619fd68cab05
3d589bcb-a28b-4ed3-a45a-614bdeebbacb	7bda9e08-19dd-4e32-9785-619fd68cab05
4bf72a4a-c55e-4886-9d5b-935c51195eb8	7bda9e08-19dd-4e32-9785-619fd68cab05
8268ac48-1291-47fc-9310-9b81a8e42469	7bda9e08-19dd-4e32-9785-619fd68cab05
024392d4-f3df-465f-9b88-51002ad68b79	7bda9e08-19dd-4e32-9785-619fd68cab05
6761f446-c29a-4cbf-a5bc-dc823ee871c7	7bda9e08-19dd-4e32-9785-619fd68cab05
4b481a36-9ccb-4010-9a6d-0466eb2e79e7	7bda9e08-19dd-4e32-9785-619fd68cab05
d2c781c6-1e92-4e3c-8228-4fbd20682359	7bda9e08-19dd-4e32-9785-619fd68cab05
c7aae22b-ca4d-4cc1-863f-f99f1a6e349f	7bda9e08-19dd-4e32-9785-619fd68cab05
2abe175c-a0d5-4053-96ba-7585920c7826	7bda9e08-19dd-4e32-9785-619fd68cab05
928138a7-88f2-4a3c-8054-457b6218cca8	7bda9e08-19dd-4e32-9785-619fd68cab05
fa41f7d0-b648-4d88-8c14-0509d6c6e4c6	7bda9e08-19dd-4e32-9785-619fd68cab05
cf3b97f8-945a-44af-aec6-2d7358c3389a	7bda9e08-19dd-4e32-9785-619fd68cab05
8a20342a-92c0-4239-ac0c-c11cfa69382d	7bda9e08-19dd-4e32-9785-619fd68cab05
00534edc-21fc-499d-985f-d8eae61426b3	7bda9e08-19dd-4e32-9785-619fd68cab05
3c5557bf-bc46-435b-b45f-3e0a6e983f6c	7d6df4ce-cfdd-4b44-a653-628e6f4cd042
\.


--
-- Data for Name: user_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_session (id, auth_method, ip_address, last_session_refresh, login_username, realm_id, remember_me, started, user_id, user_session_state, broker_session_id, broker_user_id) FROM stdin;
\.


--
-- Data for Name: user_session_note; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_session_note (user_session, name, value) FROM stdin;
\.


--
-- Data for Name: username_login_failure; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.username_login_failure (realm_id, username, failed_login_not_before, last_failure, last_ip_failure, num_failures) FROM stdin;
\.


--
-- Data for Name: web_origins; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.web_origins (client_id, value) FROM stdin;
3d3eb837-6d2b-4f86-8162-bb8c2b0cd113	+
6ee2693c-ffcb-4d4d-bcd9-08759f08cf06	+
28e7349b-8356-490d-8630-bd9aad26f316	http://localhost
\.


--
-- Name: username_login_failure CONSTRAINT_17-2; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.username_login_failure
    ADD CONSTRAINT "CONSTRAINT_17-2" PRIMARY KEY (realm_id, username);


--
-- Name: keycloak_role UK_J3RWUVD56ONTGSUHOGM184WW2-2; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT "UK_J3RWUVD56ONTGSUHOGM184WW2-2" UNIQUE (name, client_realm_constraint);


--
-- Name: client_auth_flow_bindings c_cli_flow_bind; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_auth_flow_bindings
    ADD CONSTRAINT c_cli_flow_bind PRIMARY KEY (client_id, binding_name);


--
-- Name: client_scope_client c_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_client
    ADD CONSTRAINT c_cli_scope_bind PRIMARY KEY (client_id, scope_id);


--
-- Name: client_initial_access cnstr_client_init_acc_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT cnstr_client_init_acc_pk PRIMARY KEY (id);


--
-- Name: realm_default_groups con_group_id_def_groups; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT con_group_id_def_groups UNIQUE (group_id);


--
-- Name: broker_link constr_broker_link_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.broker_link
    ADD CONSTRAINT constr_broker_link_pk PRIMARY KEY (identity_provider, user_id);


--
-- Name: client_user_session_note constr_cl_usr_ses_note; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_user_session_note
    ADD CONSTRAINT constr_cl_usr_ses_note PRIMARY KEY (client_session, name);


--
-- Name: component_config constr_component_config_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT constr_component_config_pk PRIMARY KEY (id);


--
-- Name: component constr_component_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT constr_component_pk PRIMARY KEY (id);


--
-- Name: fed_user_required_action constr_fed_required_action; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_required_action
    ADD CONSTRAINT constr_fed_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: fed_user_attribute constr_fed_user_attr_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_attribute
    ADD CONSTRAINT constr_fed_user_attr_pk PRIMARY KEY (id);


--
-- Name: fed_user_consent constr_fed_user_consent_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_consent
    ADD CONSTRAINT constr_fed_user_consent_pk PRIMARY KEY (id);


--
-- Name: fed_user_credential constr_fed_user_cred_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_credential
    ADD CONSTRAINT constr_fed_user_cred_pk PRIMARY KEY (id);


--
-- Name: fed_user_group_membership constr_fed_user_group; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_group_membership
    ADD CONSTRAINT constr_fed_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: fed_user_role_mapping constr_fed_user_role; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_role_mapping
    ADD CONSTRAINT constr_fed_user_role PRIMARY KEY (role_id, user_id);


--
-- Name: federated_user constr_federated_user; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.federated_user
    ADD CONSTRAINT constr_federated_user PRIMARY KEY (id);


--
-- Name: realm_default_groups constr_realm_default_groups; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT constr_realm_default_groups PRIMARY KEY (realm_id, group_id);


--
-- Name: realm_enabled_event_types constr_realm_enabl_event_types; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT constr_realm_enabl_event_types PRIMARY KEY (realm_id, value);


--
-- Name: realm_events_listeners constr_realm_events_listeners; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT constr_realm_events_listeners PRIMARY KEY (realm_id, value);


--
-- Name: realm_supported_locales constr_realm_supported_locales; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT constr_realm_supported_locales PRIMARY KEY (realm_id, value);


--
-- Name: identity_provider constraint_2b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT constraint_2b PRIMARY KEY (internal_id);


--
-- Name: client_attributes constraint_3c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT constraint_3c PRIMARY KEY (client_id, name);


--
-- Name: event_entity constraint_4; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.event_entity
    ADD CONSTRAINT constraint_4 PRIMARY KEY (id);


--
-- Name: federated_identity constraint_40; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT constraint_40 PRIMARY KEY (identity_provider, user_id);


--
-- Name: realm constraint_4a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT constraint_4a PRIMARY KEY (id);


--
-- Name: client_session_role constraint_5; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_role
    ADD CONSTRAINT constraint_5 PRIMARY KEY (client_session, role_id);


--
-- Name: user_session constraint_57; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT constraint_57 PRIMARY KEY (id);


--
-- Name: user_federation_provider constraint_5c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT constraint_5c PRIMARY KEY (id);


--
-- Name: client_session_note constraint_5e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_note
    ADD CONSTRAINT constraint_5e PRIMARY KEY (client_session, name);


--
-- Name: client constraint_7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT constraint_7 PRIMARY KEY (id);


--
-- Name: client_session constraint_8; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session
    ADD CONSTRAINT constraint_8 PRIMARY KEY (id);


--
-- Name: scope_mapping constraint_81; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT constraint_81 PRIMARY KEY (client_id, role_id);


--
-- Name: client_node_registrations constraint_84; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT constraint_84 PRIMARY KEY (client_id, name);


--
-- Name: realm_attribute constraint_9; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT constraint_9 PRIMARY KEY (name, realm_id);


--
-- Name: realm_required_credential constraint_92; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT constraint_92 PRIMARY KEY (realm_id, type);


--
-- Name: keycloak_role constraint_a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT constraint_a PRIMARY KEY (id);


--
-- Name: admin_event_entity constraint_admin_event_entity; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.admin_event_entity
    ADD CONSTRAINT constraint_admin_event_entity PRIMARY KEY (id);


--
-- Name: authenticator_config_entry constraint_auth_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authenticator_config_entry
    ADD CONSTRAINT constraint_auth_cfg_pk PRIMARY KEY (authenticator_id, name);


--
-- Name: authentication_execution constraint_auth_exec_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT constraint_auth_exec_pk PRIMARY KEY (id);


--
-- Name: authentication_flow constraint_auth_flow_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT constraint_auth_flow_pk PRIMARY KEY (id);


--
-- Name: authenticator_config constraint_auth_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT constraint_auth_pk PRIMARY KEY (id);


--
-- Name: client_session_auth_status constraint_auth_status_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_auth_status
    ADD CONSTRAINT constraint_auth_status_pk PRIMARY KEY (client_session, authenticator);


--
-- Name: user_role_mapping constraint_c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT constraint_c PRIMARY KEY (role_id, user_id);


--
-- Name: composite_role constraint_composite_role; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT constraint_composite_role PRIMARY KEY (composite, child_role);


--
-- Name: client_session_prot_mapper constraint_cs_pmp_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_prot_mapper
    ADD CONSTRAINT constraint_cs_pmp_pk PRIMARY KEY (client_session, protocol_mapper_id);


--
-- Name: identity_provider_config constraint_d; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT constraint_d PRIMARY KEY (identity_provider_id, name);


--
-- Name: policy_config constraint_dpc; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT constraint_dpc PRIMARY KEY (policy_id, name);


--
-- Name: realm_smtp_config constraint_e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT constraint_e PRIMARY KEY (realm_id, name);


--
-- Name: credential constraint_f; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT constraint_f PRIMARY KEY (id);


--
-- Name: user_federation_config constraint_f9; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT constraint_f9 PRIMARY KEY (user_federation_provider_id, name);


--
-- Name: resource_server_perm_ticket constraint_fapmt; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT constraint_fapmt PRIMARY KEY (id);


--
-- Name: resource_server_resource constraint_farsr; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT constraint_farsr PRIMARY KEY (id);


--
-- Name: resource_server_policy constraint_farsrp; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT constraint_farsrp PRIMARY KEY (id);


--
-- Name: associated_policy constraint_farsrpap; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT constraint_farsrpap PRIMARY KEY (policy_id, associated_policy_id);


--
-- Name: resource_policy constraint_farsrpp; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT constraint_farsrpp PRIMARY KEY (resource_id, policy_id);


--
-- Name: resource_server_scope constraint_farsrs; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT constraint_farsrs PRIMARY KEY (id);


--
-- Name: resource_scope constraint_farsrsp; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT constraint_farsrsp PRIMARY KEY (resource_id, scope_id);


--
-- Name: scope_policy constraint_farsrsps; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT constraint_farsrsps PRIMARY KEY (scope_id, policy_id);


--
-- Name: user_entity constraint_fb; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT constraint_fb PRIMARY KEY (id);


--
-- Name: user_federation_mapper_config constraint_fedmapper_cfg_pm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT constraint_fedmapper_cfg_pm PRIMARY KEY (user_federation_mapper_id, name);


--
-- Name: user_federation_mapper constraint_fedmapperpm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT constraint_fedmapperpm PRIMARY KEY (id);


--
-- Name: fed_user_consent_cl_scope constraint_fgrntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fed_user_consent_cl_scope
    ADD CONSTRAINT constraint_fgrntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- Name: user_consent_client_scope constraint_grntcsnt_clsc_pm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT constraint_grntcsnt_clsc_pm PRIMARY KEY (user_consent_id, scope_id);


--
-- Name: user_consent constraint_grntcsnt_pm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT constraint_grntcsnt_pm PRIMARY KEY (id);


--
-- Name: keycloak_group constraint_group; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT constraint_group PRIMARY KEY (id);


--
-- Name: group_attribute constraint_group_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT constraint_group_attribute_pk PRIMARY KEY (id);


--
-- Name: group_role_mapping constraint_group_role; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT constraint_group_role PRIMARY KEY (role_id, group_id);


--
-- Name: identity_provider_mapper constraint_idpm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT constraint_idpm PRIMARY KEY (id);


--
-- Name: idp_mapper_config constraint_idpmconfig; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT constraint_idpmconfig PRIMARY KEY (idp_mapper_id, name);


--
-- Name: migration_model constraint_migmod; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.migration_model
    ADD CONSTRAINT constraint_migmod PRIMARY KEY (id);


--
-- Name: offline_client_session constraint_offl_cl_ses_pk3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.offline_client_session
    ADD CONSTRAINT constraint_offl_cl_ses_pk3 PRIMARY KEY (user_session_id, client_id, client_storage_provider, external_client_id, offline_flag);


--
-- Name: offline_user_session constraint_offl_us_ses_pk2; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.offline_user_session
    ADD CONSTRAINT constraint_offl_us_ses_pk2 PRIMARY KEY (user_session_id, offline_flag);


--
-- Name: protocol_mapper constraint_pcm; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT constraint_pcm PRIMARY KEY (id);


--
-- Name: protocol_mapper_config constraint_pmconfig; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT constraint_pmconfig PRIMARY KEY (protocol_mapper_id, name);


--
-- Name: redirect_uris constraint_redirect_uris; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT constraint_redirect_uris PRIMARY KEY (client_id, value);


--
-- Name: required_action_config constraint_req_act_cfg_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.required_action_config
    ADD CONSTRAINT constraint_req_act_cfg_pk PRIMARY KEY (required_action_id, name);


--
-- Name: required_action_provider constraint_req_act_prv_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT constraint_req_act_prv_pk PRIMARY KEY (id);


--
-- Name: user_required_action constraint_required_action; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT constraint_required_action PRIMARY KEY (required_action, user_id);


--
-- Name: resource_uris constraint_resour_uris_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT constraint_resour_uris_pk PRIMARY KEY (resource_id, value);


--
-- Name: role_attribute constraint_role_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT constraint_role_attribute_pk PRIMARY KEY (id);


--
-- Name: user_attribute constraint_user_attribute_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT constraint_user_attribute_pk PRIMARY KEY (id);


--
-- Name: user_group_membership constraint_user_group; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT constraint_user_group PRIMARY KEY (group_id, user_id);


--
-- Name: user_session_note constraint_usn_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_session_note
    ADD CONSTRAINT constraint_usn_pk PRIMARY KEY (user_session, name);


--
-- Name: web_origins constraint_web_origins; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT constraint_web_origins PRIMARY KEY (client_id, value);


--
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- Name: client_scope_attributes pk_cl_tmpl_attr; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT pk_cl_tmpl_attr PRIMARY KEY (scope_id, name);


--
-- Name: client_scope pk_cli_template; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT pk_cli_template PRIMARY KEY (id);


--
-- Name: resource_server pk_resource_server; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server
    ADD CONSTRAINT pk_resource_server PRIMARY KEY (id);


--
-- Name: client_scope_role_mapping pk_template_scope; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT pk_template_scope PRIMARY KEY (scope_id, role_id);


--
-- Name: default_client_scope r_def_cli_scope_bind; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT r_def_cli_scope_bind PRIMARY KEY (realm_id, scope_id);


--
-- Name: realm_localizations realm_localizations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_localizations
    ADD CONSTRAINT realm_localizations_pkey PRIMARY KEY (realm_id, locale);


--
-- Name: resource_attribute res_attr_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT res_attr_pk PRIMARY KEY (id);


--
-- Name: keycloak_group sibling_names; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_group
    ADD CONSTRAINT sibling_names UNIQUE (realm_id, parent_group, name);


--
-- Name: identity_provider uk_2daelwnibji49avxsrtuf6xj33; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT uk_2daelwnibji49avxsrtuf6xj33 UNIQUE (provider_alias, realm_id);


--
-- Name: client uk_b71cjlbenv945rb6gcon438at; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT uk_b71cjlbenv945rb6gcon438at UNIQUE (realm_id, client_id);


--
-- Name: client_scope uk_cli_scope; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope
    ADD CONSTRAINT uk_cli_scope UNIQUE (realm_id, name);


--
-- Name: user_entity uk_dykn684sl8up1crfei6eckhd7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_dykn684sl8up1crfei6eckhd7 UNIQUE (realm_id, email_constraint);


--
-- Name: resource_server_resource uk_frsr6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5ha6 UNIQUE (name, owner, resource_server_id);


--
-- Name: resource_server_perm_ticket uk_frsr6t700s9v50bu18ws5pmt; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT uk_frsr6t700s9v50bu18ws5pmt UNIQUE (owner, requester, resource_server_id, resource_id, scope_id);


--
-- Name: resource_server_policy uk_frsrpt700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT uk_frsrpt700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: resource_server_scope uk_frsrst700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT uk_frsrst700s9v50bu18ws5ha6 UNIQUE (name, resource_server_id);


--
-- Name: user_consent uk_jkuwuvd56ontgsuhogm8uewrt; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT uk_jkuwuvd56ontgsuhogm8uewrt UNIQUE (client_id, client_storage_provider, external_client_id, user_id);


--
-- Name: realm uk_orvsdmla56612eaefiq6wl5oi; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm
    ADD CONSTRAINT uk_orvsdmla56612eaefiq6wl5oi UNIQUE (name);


--
-- Name: user_entity uk_ru8tt6t700s9v50bu18ws5ha6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_entity
    ADD CONSTRAINT uk_ru8tt6t700s9v50bu18ws5ha6 UNIQUE (realm_id, username);


--
-- Name: idx_admin_event_time; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_admin_event_time ON public.admin_event_entity USING btree (realm_id, admin_event_time);


--
-- Name: idx_assoc_pol_assoc_pol_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_assoc_pol_assoc_pol_id ON public.associated_policy USING btree (associated_policy_id);


--
-- Name: idx_auth_config_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_auth_config_realm ON public.authenticator_config USING btree (realm_id);


--
-- Name: idx_auth_exec_flow; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_auth_exec_flow ON public.authentication_execution USING btree (flow_id);


--
-- Name: idx_auth_exec_realm_flow; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_auth_exec_realm_flow ON public.authentication_execution USING btree (realm_id, flow_id);


--
-- Name: idx_auth_flow_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_auth_flow_realm ON public.authentication_flow USING btree (realm_id);


--
-- Name: idx_cl_clscope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_cl_clscope ON public.client_scope_client USING btree (scope_id);


--
-- Name: idx_client_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_client_id ON public.client USING btree (client_id);


--
-- Name: idx_client_init_acc_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_client_init_acc_realm ON public.client_initial_access USING btree (realm_id);


--
-- Name: idx_client_session_session; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_client_session_session ON public.client_session USING btree (session_id);


--
-- Name: idx_clscope_attrs; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_clscope_attrs ON public.client_scope_attributes USING btree (scope_id);


--
-- Name: idx_clscope_cl; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_clscope_cl ON public.client_scope_client USING btree (client_id);


--
-- Name: idx_clscope_protmap; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_clscope_protmap ON public.protocol_mapper USING btree (client_scope_id);


--
-- Name: idx_clscope_role; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_clscope_role ON public.client_scope_role_mapping USING btree (scope_id);


--
-- Name: idx_compo_config_compo; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_compo_config_compo ON public.component_config USING btree (component_id);


--
-- Name: idx_component_provider_type; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_component_provider_type ON public.component USING btree (provider_type);


--
-- Name: idx_component_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_component_realm ON public.component USING btree (realm_id);


--
-- Name: idx_composite; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_composite ON public.composite_role USING btree (composite);


--
-- Name: idx_composite_child; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_composite_child ON public.composite_role USING btree (child_role);


--
-- Name: idx_defcls_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_defcls_realm ON public.default_client_scope USING btree (realm_id);


--
-- Name: idx_defcls_scope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_defcls_scope ON public.default_client_scope USING btree (scope_id);


--
-- Name: idx_event_time; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_event_time ON public.event_entity USING btree (realm_id, event_time);


--
-- Name: idx_fedidentity_feduser; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fedidentity_feduser ON public.federated_identity USING btree (federated_user_id);


--
-- Name: idx_fedidentity_user; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fedidentity_user ON public.federated_identity USING btree (user_id);


--
-- Name: idx_fu_attribute; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_attribute ON public.fed_user_attribute USING btree (user_id, realm_id, name);


--
-- Name: idx_fu_cnsnt_ext; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_cnsnt_ext ON public.fed_user_consent USING btree (user_id, client_storage_provider, external_client_id);


--
-- Name: idx_fu_consent; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_consent ON public.fed_user_consent USING btree (user_id, client_id);


--
-- Name: idx_fu_consent_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_consent_ru ON public.fed_user_consent USING btree (realm_id, user_id);


--
-- Name: idx_fu_credential; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_credential ON public.fed_user_credential USING btree (user_id, type);


--
-- Name: idx_fu_credential_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_credential_ru ON public.fed_user_credential USING btree (realm_id, user_id);


--
-- Name: idx_fu_group_membership; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_group_membership ON public.fed_user_group_membership USING btree (user_id, group_id);


--
-- Name: idx_fu_group_membership_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_group_membership_ru ON public.fed_user_group_membership USING btree (realm_id, user_id);


--
-- Name: idx_fu_required_action; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_required_action ON public.fed_user_required_action USING btree (user_id, required_action);


--
-- Name: idx_fu_required_action_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_required_action_ru ON public.fed_user_required_action USING btree (realm_id, user_id);


--
-- Name: idx_fu_role_mapping; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_role_mapping ON public.fed_user_role_mapping USING btree (user_id, role_id);


--
-- Name: idx_fu_role_mapping_ru; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_fu_role_mapping_ru ON public.fed_user_role_mapping USING btree (realm_id, user_id);


--
-- Name: idx_group_att_by_name_value; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_group_att_by_name_value ON public.group_attribute USING btree (name, ((value)::character varying(250)));


--
-- Name: idx_group_attr_group; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_group_attr_group ON public.group_attribute USING btree (group_id);


--
-- Name: idx_group_role_mapp_group; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_group_role_mapp_group ON public.group_role_mapping USING btree (group_id);


--
-- Name: idx_id_prov_mapp_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_id_prov_mapp_realm ON public.identity_provider_mapper USING btree (realm_id);


--
-- Name: idx_ident_prov_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_ident_prov_realm ON public.identity_provider USING btree (realm_id);


--
-- Name: idx_keycloak_role_client; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_keycloak_role_client ON public.keycloak_role USING btree (client);


--
-- Name: idx_keycloak_role_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_keycloak_role_realm ON public.keycloak_role USING btree (realm);


--
-- Name: idx_offline_css_preload; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_css_preload ON public.offline_client_session USING btree (client_id, offline_flag);


--
-- Name: idx_offline_uss_by_user; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_uss_by_user ON public.offline_user_session USING btree (user_id, realm_id, offline_flag);


--
-- Name: idx_offline_uss_by_usersess; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_uss_by_usersess ON public.offline_user_session USING btree (realm_id, offline_flag, user_session_id);


--
-- Name: idx_offline_uss_createdon; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_uss_createdon ON public.offline_user_session USING btree (created_on);


--
-- Name: idx_offline_uss_preload; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_offline_uss_preload ON public.offline_user_session USING btree (offline_flag, created_on, user_session_id);


--
-- Name: idx_protocol_mapper_client; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_protocol_mapper_client ON public.protocol_mapper USING btree (client_id);


--
-- Name: idx_realm_attr_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_attr_realm ON public.realm_attribute USING btree (realm_id);


--
-- Name: idx_realm_clscope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_clscope ON public.client_scope USING btree (realm_id);


--
-- Name: idx_realm_def_grp_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_def_grp_realm ON public.realm_default_groups USING btree (realm_id);


--
-- Name: idx_realm_evt_list_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_evt_list_realm ON public.realm_events_listeners USING btree (realm_id);


--
-- Name: idx_realm_evt_types_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_evt_types_realm ON public.realm_enabled_event_types USING btree (realm_id);


--
-- Name: idx_realm_master_adm_cli; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_master_adm_cli ON public.realm USING btree (master_admin_client);


--
-- Name: idx_realm_supp_local_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_realm_supp_local_realm ON public.realm_supported_locales USING btree (realm_id);


--
-- Name: idx_redir_uri_client; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_redir_uri_client ON public.redirect_uris USING btree (client_id);


--
-- Name: idx_req_act_prov_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_req_act_prov_realm ON public.required_action_provider USING btree (realm_id);


--
-- Name: idx_res_policy_policy; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_policy_policy ON public.resource_policy USING btree (policy_id);


--
-- Name: idx_res_scope_scope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_scope_scope ON public.resource_scope USING btree (scope_id);


--
-- Name: idx_res_serv_pol_res_serv; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_serv_pol_res_serv ON public.resource_server_policy USING btree (resource_server_id);


--
-- Name: idx_res_srv_res_res_srv; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_srv_res_res_srv ON public.resource_server_resource USING btree (resource_server_id);


--
-- Name: idx_res_srv_scope_res_srv; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_res_srv_scope_res_srv ON public.resource_server_scope USING btree (resource_server_id);


--
-- Name: idx_role_attribute; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_role_attribute ON public.role_attribute USING btree (role_id);


--
-- Name: idx_role_clscope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_role_clscope ON public.client_scope_role_mapping USING btree (role_id);


--
-- Name: idx_scope_mapping_role; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_scope_mapping_role ON public.scope_mapping USING btree (role_id);


--
-- Name: idx_scope_policy_policy; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_scope_policy_policy ON public.scope_policy USING btree (policy_id);


--
-- Name: idx_update_time; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_update_time ON public.migration_model USING btree (update_time);


--
-- Name: idx_us_sess_id_on_cl_sess; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_us_sess_id_on_cl_sess ON public.offline_client_session USING btree (user_session_id);


--
-- Name: idx_usconsent_clscope; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_usconsent_clscope ON public.user_consent_client_scope USING btree (user_consent_id);


--
-- Name: idx_user_attribute; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_attribute ON public.user_attribute USING btree (user_id);


--
-- Name: idx_user_attribute_name; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_attribute_name ON public.user_attribute USING btree (name, value);


--
-- Name: idx_user_consent; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_consent ON public.user_consent USING btree (user_id);


--
-- Name: idx_user_credential; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_credential ON public.credential USING btree (user_id);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_email ON public.user_entity USING btree (email);


--
-- Name: idx_user_group_mapping; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_group_mapping ON public.user_group_membership USING btree (user_id);


--
-- Name: idx_user_reqactions; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_reqactions ON public.user_required_action USING btree (user_id);


--
-- Name: idx_user_role_mapping; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_role_mapping ON public.user_role_mapping USING btree (user_id);


--
-- Name: idx_user_service_account; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_user_service_account ON public.user_entity USING btree (realm_id, service_account_client_link);


--
-- Name: idx_usr_fed_map_fed_prv; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_usr_fed_map_fed_prv ON public.user_federation_mapper USING btree (federation_provider_id);


--
-- Name: idx_usr_fed_map_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_usr_fed_map_realm ON public.user_federation_mapper USING btree (realm_id);


--
-- Name: idx_usr_fed_prv_realm; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_usr_fed_prv_realm ON public.user_federation_provider USING btree (realm_id);


--
-- Name: idx_web_orig_client; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_web_orig_client ON public.web_origins USING btree (client_id);


--
-- Name: client_session_auth_status auth_status_constraint; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_auth_status
    ADD CONSTRAINT auth_status_constraint FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: identity_provider fk2b4ebc52ae5c3b34; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider
    ADD CONSTRAINT fk2b4ebc52ae5c3b34 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_attributes fk3c47c64beacca966; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_attributes
    ADD CONSTRAINT fk3c47c64beacca966 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: federated_identity fk404288b92ef007a6; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.federated_identity
    ADD CONSTRAINT fk404288b92ef007a6 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_node_registrations fk4129723ba992f594; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_node_registrations
    ADD CONSTRAINT fk4129723ba992f594 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: client_session_note fk5edfb00ff51c2736; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_note
    ADD CONSTRAINT fk5edfb00ff51c2736 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: user_session_note fk5edfb00ff51d3472; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_session_note
    ADD CONSTRAINT fk5edfb00ff51d3472 FOREIGN KEY (user_session) REFERENCES public.user_session(id);


--
-- Name: client_session_role fk_11b7sgqw18i532811v7o2dv76; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_role
    ADD CONSTRAINT fk_11b7sgqw18i532811v7o2dv76 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: redirect_uris fk_1burs8pb4ouj97h5wuppahv9f; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.redirect_uris
    ADD CONSTRAINT fk_1burs8pb4ouj97h5wuppahv9f FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: user_federation_provider fk_1fj32f6ptolw2qy60cd8n01e8; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_provider
    ADD CONSTRAINT fk_1fj32f6ptolw2qy60cd8n01e8 FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_session_prot_mapper fk_33a8sgqw18i532811v7o2dk89; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session_prot_mapper
    ADD CONSTRAINT fk_33a8sgqw18i532811v7o2dk89 FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: realm_required_credential fk_5hg65lybevavkqfki3kponh9v; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_required_credential
    ADD CONSTRAINT fk_5hg65lybevavkqfki3kponh9v FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_attribute fk_5hrm2vlf9ql5fu022kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu022kqepovbr FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: user_attribute fk_5hrm2vlf9ql5fu043kqepovbr; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_attribute
    ADD CONSTRAINT fk_5hrm2vlf9ql5fu043kqepovbr FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: user_required_action fk_6qj3w1jw9cvafhe19bwsiuvmd; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_required_action
    ADD CONSTRAINT fk_6qj3w1jw9cvafhe19bwsiuvmd FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: keycloak_role fk_6vyqfe4cn4wlq8r6kt5vdsj5c; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.keycloak_role
    ADD CONSTRAINT fk_6vyqfe4cn4wlq8r6kt5vdsj5c FOREIGN KEY (realm) REFERENCES public.realm(id);


--
-- Name: realm_smtp_config fk_70ej8xdxgxd0b9hh6180irr0o; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_smtp_config
    ADD CONSTRAINT fk_70ej8xdxgxd0b9hh6180irr0o FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_attribute fk_8shxd6l3e9atqukacxgpffptw; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_attribute
    ADD CONSTRAINT fk_8shxd6l3e9atqukacxgpffptw FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: composite_role fk_a63wvekftu8jo1pnj81e7mce2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_a63wvekftu8jo1pnj81e7mce2 FOREIGN KEY (composite) REFERENCES public.keycloak_role(id);


--
-- Name: authentication_execution fk_auth_exec_flow; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_flow FOREIGN KEY (flow_id) REFERENCES public.authentication_flow(id);


--
-- Name: authentication_execution fk_auth_exec_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_execution
    ADD CONSTRAINT fk_auth_exec_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authentication_flow fk_auth_flow_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authentication_flow
    ADD CONSTRAINT fk_auth_flow_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: authenticator_config fk_auth_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.authenticator_config
    ADD CONSTRAINT fk_auth_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: client_session fk_b4ao2vcvat6ukau74wbwtfqo1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_session
    ADD CONSTRAINT fk_b4ao2vcvat6ukau74wbwtfqo1 FOREIGN KEY (session_id) REFERENCES public.user_session(id);


--
-- Name: user_role_mapping fk_c4fqv34p1mbylloxang7b1q3l; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_role_mapping
    ADD CONSTRAINT fk_c4fqv34p1mbylloxang7b1q3l FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: client_scope_attributes fk_cl_scope_attr_scope; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_attributes
    ADD CONSTRAINT fk_cl_scope_attr_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_scope_role_mapping fk_cl_scope_rm_scope; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_scope_role_mapping
    ADD CONSTRAINT fk_cl_scope_rm_scope FOREIGN KEY (scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_user_session_note fk_cl_usr_ses_note; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_user_session_note
    ADD CONSTRAINT fk_cl_usr_ses_note FOREIGN KEY (client_session) REFERENCES public.client_session(id);


--
-- Name: protocol_mapper fk_cli_scope_mapper; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_cli_scope_mapper FOREIGN KEY (client_scope_id) REFERENCES public.client_scope(id);


--
-- Name: client_initial_access fk_client_init_acc_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.client_initial_access
    ADD CONSTRAINT fk_client_init_acc_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: component_config fk_component_config; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.component_config
    ADD CONSTRAINT fk_component_config FOREIGN KEY (component_id) REFERENCES public.component(id);


--
-- Name: component fk_component_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.component
    ADD CONSTRAINT fk_component_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_default_groups fk_def_groups_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_default_groups
    ADD CONSTRAINT fk_def_groups_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_mapper_config fk_fedmapper_cfg; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper_config
    ADD CONSTRAINT fk_fedmapper_cfg FOREIGN KEY (user_federation_mapper_id) REFERENCES public.user_federation_mapper(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_fedprv; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_fedprv FOREIGN KEY (federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_federation_mapper fk_fedmapperpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_mapper
    ADD CONSTRAINT fk_fedmapperpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: associated_policy fk_frsr5s213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsr5s213xcx4wnkog82ssrfy FOREIGN KEY (associated_policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrasp13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrasp13xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog82sspmt; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82sspmt FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_resource fk_frsrho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_resource
    ADD CONSTRAINT fk_frsrho213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog83sspmt; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog83sspmt FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_server_perm_ticket fk_frsrho213xcx4wnkog84sspmt; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrho213xcx4wnkog84sspmt FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: associated_policy fk_frsrpas14xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.associated_policy
    ADD CONSTRAINT fk_frsrpas14xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: scope_policy fk_frsrpass3xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_policy
    ADD CONSTRAINT fk_frsrpass3xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_perm_ticket fk_frsrpo2128cx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_perm_ticket
    ADD CONSTRAINT fk_frsrpo2128cx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_server_policy fk_frsrpo213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_policy
    ADD CONSTRAINT fk_frsrpo213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: resource_scope fk_frsrpos13xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrpos13xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpos53xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpos53xcx4wnkog82ssrfy FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: resource_policy fk_frsrpp213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_policy
    ADD CONSTRAINT fk_frsrpp213xcx4wnkog82ssrfy FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: resource_scope fk_frsrps213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_scope
    ADD CONSTRAINT fk_frsrps213xcx4wnkog82ssrfy FOREIGN KEY (scope_id) REFERENCES public.resource_server_scope(id);


--
-- Name: resource_server_scope fk_frsrso213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_server_scope
    ADD CONSTRAINT fk_frsrso213xcx4wnkog82ssrfy FOREIGN KEY (resource_server_id) REFERENCES public.resource_server(id);


--
-- Name: composite_role fk_gr7thllb9lu8q4vqa4524jjy8; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.composite_role
    ADD CONSTRAINT fk_gr7thllb9lu8q4vqa4524jjy8 FOREIGN KEY (child_role) REFERENCES public.keycloak_role(id);


--
-- Name: user_consent_client_scope fk_grntcsnt_clsc_usc; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent_client_scope
    ADD CONSTRAINT fk_grntcsnt_clsc_usc FOREIGN KEY (user_consent_id) REFERENCES public.user_consent(id);


--
-- Name: user_consent fk_grntcsnt_user; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_consent
    ADD CONSTRAINT fk_grntcsnt_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: group_attribute fk_group_attribute_group; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.group_attribute
    ADD CONSTRAINT fk_group_attribute_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: group_role_mapping fk_group_role_group; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.group_role_mapping
    ADD CONSTRAINT fk_group_role_group FOREIGN KEY (group_id) REFERENCES public.keycloak_group(id);


--
-- Name: realm_enabled_event_types fk_h846o4h0w8epx5nwedrf5y69j; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_enabled_event_types
    ADD CONSTRAINT fk_h846o4h0w8epx5nwedrf5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: realm_events_listeners fk_h846o4h0w8epx5nxev9f5y69j; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_events_listeners
    ADD CONSTRAINT fk_h846o4h0w8epx5nxev9f5y69j FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: identity_provider_mapper fk_idpm_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider_mapper
    ADD CONSTRAINT fk_idpm_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: idp_mapper_config fk_idpmconfig; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.idp_mapper_config
    ADD CONSTRAINT fk_idpmconfig FOREIGN KEY (idp_mapper_id) REFERENCES public.identity_provider_mapper(id);


--
-- Name: web_origins fk_lojpho213xcx4wnkog82ssrfy; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.web_origins
    ADD CONSTRAINT fk_lojpho213xcx4wnkog82ssrfy FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: scope_mapping fk_ouse064plmlr732lxjcn1q5f1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.scope_mapping
    ADD CONSTRAINT fk_ouse064plmlr732lxjcn1q5f1 FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: protocol_mapper fk_pcm_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper
    ADD CONSTRAINT fk_pcm_realm FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: credential fk_pfyr0glasqyl0dei3kl69r6v0; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.credential
    ADD CONSTRAINT fk_pfyr0glasqyl0dei3kl69r6v0 FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: protocol_mapper_config fk_pmconfig; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.protocol_mapper_config
    ADD CONSTRAINT fk_pmconfig FOREIGN KEY (protocol_mapper_id) REFERENCES public.protocol_mapper(id);


--
-- Name: default_client_scope fk_r_def_cli_scope_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.default_client_scope
    ADD CONSTRAINT fk_r_def_cli_scope_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: required_action_provider fk_req_act_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.required_action_provider
    ADD CONSTRAINT fk_req_act_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: resource_uris fk_resource_server_uris; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_uris
    ADD CONSTRAINT fk_resource_server_uris FOREIGN KEY (resource_id) REFERENCES public.resource_server_resource(id);


--
-- Name: role_attribute fk_role_attribute_id; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role_attribute
    ADD CONSTRAINT fk_role_attribute_id FOREIGN KEY (role_id) REFERENCES public.keycloak_role(id);


--
-- Name: realm_supported_locales fk_supported_locales_realm; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.realm_supported_locales
    ADD CONSTRAINT fk_supported_locales_realm FOREIGN KEY (realm_id) REFERENCES public.realm(id);


--
-- Name: user_federation_config fk_t13hpu1j94r2ebpekr39x5eu5; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_federation_config
    ADD CONSTRAINT fk_t13hpu1j94r2ebpekr39x5eu5 FOREIGN KEY (user_federation_provider_id) REFERENCES public.user_federation_provider(id);


--
-- Name: user_group_membership fk_user_group_user; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_group_membership
    ADD CONSTRAINT fk_user_group_user FOREIGN KEY (user_id) REFERENCES public.user_entity(id);


--
-- Name: policy_config fkdc34197cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.policy_config
    ADD CONSTRAINT fkdc34197cf864c4e43 FOREIGN KEY (policy_id) REFERENCES public.resource_server_policy(id);


--
-- Name: identity_provider_config fkdc4897cf864c4e43; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.identity_provider_config
    ADD CONSTRAINT fkdc4897cf864c4e43 FOREIGN KEY (identity_provider_id) REFERENCES public.identity_provider(internal_id);


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 13.12
-- Dumped by pg_dump version 13.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

