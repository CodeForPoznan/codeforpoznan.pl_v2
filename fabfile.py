# -*- coding: utf-8 -*-

u"""
.. module:: fabfile
"""


from fabric.api import cd
from fabric.api import env
from fabric.api import run


env.user = 'root'
env.hosts = ['codeforpoznan.pl']
env.forward_agent = True


def update():
    u"""Function defining all steps required to properly update application."""
    with cd('/var/www/codeforpoznan.pl_v2'):
        run('git pull')
    
    run('systemctl restart nginx')
