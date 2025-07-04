import threading, logging, os
from subprocess import Popen, PIPE

logger = logging.getLogger(__name__)

def renewall() -> None:
  threading.Timer(604800.0, renewall).start()

  p = Popen(['certbot', 'certonly', '--noninteractive', '--agree-tos', '--force-renew', '-v', '-d', os.getenv("DOMAIN"), '--register-unsafely-without-email', '--webroot', '-w', '/var/www/letsencrypt/'], stdin=PIPE, stdout=PIPE, stderr=PIPE)
  output, err = p.communicate()

  logger.info(output)
  logger.error(err)

renewall()