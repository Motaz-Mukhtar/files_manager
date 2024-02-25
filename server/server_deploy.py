#!/usr/bin/python3
"""
	Fabric script that creates and distributes
	an archive to the web servers.
"""
from os.path import isdir, exists
from datetime import datetime
from fabric.api import local
from fabric.api import env
from fabric.api import run, sudo
from fabric.api import put
env.hosts = ['54.165.42.34']


def do_pack():
	"""
		Generates a tgz archive.
	"""
	date = datetime.now().strftime("%Y.%m.%d.%H.%M.%S")
	try:
		if isdir("versions") is False:
			local("mkdir versions")
		file_name = "versions/web_api_{}.tgz".format(date)

		local('tar -czvf {} ./* ../package.json'.format(file_name))
		return file_name
	except Exception:
		return None


def do_deploy(archive_path):
	"""
		Distributes an archive to the web servers
	"""
	if exists(archive_path) is False:
		return False

	try:
		file_name = archive_path.split('/')[-1]
		no_ext = file_name.split('.')[0]
		path = "/var/www/web_api/releases/"

		put(archive_path, '/tmp/')

		sudo("mkdir -p {}{}".format(path, no_ext))
		
		sudo("tar -xvf /tmp/{} -C {}{}".format(file_name, path, no_ext))

		sudo("rm -r /tmp/{}".format(file_name))

		sudo("rm -rf {}{}/web_api".format(path, no_ext))

		sudo("rm -rf /var/www/web_api/current")

		sudo("ln -s {}{} /var/www/web_api/current".format(path, no_ext))
		return True
	except Exception:
		return False


def deploy():
	"""
		Creates and destributes an archive to your web servers
	"""
	file = do_pack()

	if file is None:
		return False

	return do_deploy(file)
