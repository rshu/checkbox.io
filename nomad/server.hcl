# Increase log verbosity
log_level = "DEBUG"

# Setup data dir
data_dir = "/opt/nomad"

server {
  enabled = true
  bootstrap_expect = 1
}
